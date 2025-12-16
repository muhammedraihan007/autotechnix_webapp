const Breakdown = require('../models/Breakdown');
const Car = require('../models/Car'); // Import the Car model

// @desc    Create a breakdown request
// @route   POST /api/breakdowns
// @access  Private (Customer)
exports.createBreakdown = async (req, res) => {
  const { car: carId, latitude, longitude, notes } = req.body; // Rename car to carId to avoid conflict

  if (!latitude || !longitude) {
    return res.status(400).json({ msg: 'Location is required' });
  }
  if (!carId) {
    return res.status(400).json({ msg: 'Car is required' });
  }

  try {
    // Verify car ownership
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }
    if (car.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to create breakdown for this car' });
    }

    const newBreakdown = new Breakdown({
      customer: req.user.id,
      car: carId, // Use carId here
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      notes,
    });

    const breakdown = await newBreakdown.save();
    res.json(breakdown);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all breakdown requests
// @route   GET /api/breakdowns
// @access  Private (Admin)
exports.getBreakdowns = async (req, res) => {
  try {
    const breakdowns = await Breakdown.find()
      .populate('customer', ['name', 'phone'])
      .populate('car', ['make', 'model', 'regNo'])
      .sort({ createdAt: -1 });
    res.json(breakdowns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a specific breakdown request
// @route   GET /api/breakdowns/:id
// @access  Private (Admin)
exports.getBreakdown = async (req, res) => {
  try {
    const breakdown = await Breakdown.findById(req.params.id)
      .populate('customer', ['name', 'phone'])
      .populate('car', ['make', 'model', 'regNo']);

    if (!breakdown) {
      return res.status(404).json({ msg: 'Breakdown not found' });
    }

    res.json(breakdown);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Breakdown not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a breakdown request status
// @route   PUT /api/breakdowns/:id
// @access  Private (Admin)
exports.updateBreakdownStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let breakdown = await Breakdown.findById(req.params.id);

    if (!breakdown) {
      return res.status(404).json({ msg: 'Breakdown not found' });
    }

    breakdown.status = status;
    await breakdown.save();

    res.json(breakdown);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Breakdown not found' });
    }
    res.status(500).send('Server Error');
  }
};

