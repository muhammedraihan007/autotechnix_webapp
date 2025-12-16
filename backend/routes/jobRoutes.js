const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth');
const { createJob, getJob, updateStatus, useParts, listJobs, uploadAudio, updateNotes, getJobsByCarId } = require('../controllers/jobController');
const multer = require('multer');

// Multer config for audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/audio/');
  },
  filename: function (req, file, cb) {
    cb(null, `job-${req.params.id}-${Date.now()}.wav`);
  }
});

const upload = multer({ storage: storage });

router.post('/', auth, createJob);
router.get('/', adminOnly, listJobs); // list with pagination
router.get('/:id', auth, getJob);
router.get('/car/:carId', auth, getJobsByCarId); // New route to get jobs by car ID
router.patch('/:id/status', adminOnly, updateStatus);
router.patch('/:id/notes', adminOnly, updateNotes);
router.post('/:id/use-parts', adminOnly, useParts);
router.post('/:id/audio', auth, upload.single('audio'), uploadAudio);

module.exports = router;
