const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const Job = require('../models/Job');

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, path.join(__dirname, '..', 'uploads')) },
  filename: function(req,file,cb){ cb(null, Date.now() + '-' + file.originalname) }
});
const upload = multer({ storage });

// upload before images
router.post('/:id/upload-before', auth, upload.array('images', 5), async (req,res) => {
  const job = await Job.findById(req.params.id);
  if(!job) return res.status(404).json({ msg: 'Job not found' });
  const files = req.files.map(f => '/uploads/' + f.filename);
  job.beforeImages = (job.beforeImages || []).concat(files);
  await job.save();
  res.json({ files, job });
});

// upload after images
router.post('/:id/upload-after', adminOnly, upload.array('images', 5), async (req,res) => {
  const job = await Job.findById(req.params.id);
  if(!job) return res.status(404).json({ msg: 'Job not found' });
  const files = req.files.map(f => '/uploads/' + f.filename);
  job.afterImages = (job.afterImages || []).concat(files);
  await job.save();
  res.json({ files, job });
});

module.exports = router;
