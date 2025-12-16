const Job = require('../models/Job');
const Inventory = require('../models/Inventory');
const Car = require('../models/Car');
const sendWhatsApp = require('../utils/sendWhatsApp');
const { getIO, getUserSockets } = require('../socket'); // Correctly import from socket module

exports.createJob = async (req,res) => {
  try {
    const { customer, car, complaint, intakeDate, estDeliveryDate } = req.body;
    const cust = req.user?.id || customer;
    if(!cust || !car) return res.status(400).json({ msg: 'customer and car are required' });
    const job = new Job({ customer: cust, car, complaint, intakeDate, estDeliveryDate });
    await job.save();
    if(req.body.customerPhone) {
      try{ await sendWhatsApp(req.body.customerPhone, `Your job ${job._id} is created.`); }catch(e){ console.error(e); }
    }
    res.json(job);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
};

exports.getJob = async (req,res) => {
  const job = await Job.findById(req.params.id).populate('partsUsed.part').populate('car').populate('customer');
  if(!job) return res.status(404).json({ msg: 'Job not found' });
  res.json(job);
};

// New function to get jobs by car ID
exports.getJobsByCarId = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view jobs for this car' });
    }

    const jobs = await Job.find({ car: carId })
                          .populate('car')
                          .populate('customer')
                          .sort({ intakeDate: -1 });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateStatus = async (req,res) => {
  const { status } = req.body;
  const job = await Job.findById(req.params.id).populate('customer').populate('car');
  if(!job) return res.status(404).json({ msg: 'Job not found' });

  job.status = status;
  await job.save();
  
  try {
    const io = getIO();
    const userSockets = getUserSockets(); // Get sockets from the function
    const customerId = job.customer._id.toString();
    const socketId = userSockets[customerId];

    if (socketId) {
      io.to(socketId).emit('jobStatusUpdated', {
        jobId: job._id,
        status: job.status,
        message: `Status for your ${job.car.make} ${job.car.model} is now: ${job.status}`
      });
    }
  } catch (e) {
    console.error('Socket.IO emission error:', e);
  }

  const userPhone = req.body.customerPhone || job.customer.phone;
  if(userPhone) {
    try{ await sendWhatsApp(userPhone, `Job ${job._id} status updated to ${status}`); }catch(e){ console.error(e); }
  }
  res.json(job);
};

exports.useParts = async (req,res) => {
  const { parts } = req.body;
  if(!Array.isArray(parts)) return res.status(400).json({ msg: 'parts array required' });
  const job = await Job.findById(req.params.id);
  if(!job) return res.status(404).json({ msg: 'Job not found' });
  let partsUsed = [];
  for(const p of parts){
    const partDoc = await Inventory.findById(p.partId);
    if(!partDoc) return res.status(400).json({ msg: 'Part not found' });
    if(partDoc.stock < p.qty) return res.status(400).json({ msg: `Insufficient stock for ${partDoc.partName}` });
    partDoc.stock -= p.qty;
    await partDoc.save();
    partsUsed.push({ part: partDoc._id, qty: p.qty, price: partDoc.price });
  }
  job.partsUsed = job.partsUsed.concat(partsUsed);
  await job.save();
  res.json(job);
};

exports.listJobs = async (req,res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;
  const filter = {};
  if(req.query.status) filter.status = req.query.status;

  if (req.user?.role === 'customer') {
    filter.customer = req.user.id;
  }
  
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter).skip(skip).limit(pageSize).sort({ intakeDate: -1 }).populate('car').populate('customer');
  res.json({ total, page, pageSize, jobs });
};

exports.uploadAudio = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.audioRecording = req.file.path;
    await job.save();

    res.json({ msg: 'Audio uploaded successfully', job, filePath: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.notes = notes;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
