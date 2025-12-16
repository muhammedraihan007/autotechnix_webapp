const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { addCar, listCarsByOwner, deleteCar, updateCar, getCarById } = require('../controllers/carController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, path.join(__dirname, '..', 'uploads')) },
  filename: function(req,file,cb){ cb(null, Date.now() + '-' + file.originalname) }
});
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), addCar);
router.get('/', auth, listCarsByOwner);
router.get('/:id', auth, getCarById);
router.put('/:id', auth, upload.single('image'), updateCar);
router.delete('/:id', auth, deleteCar);

module.exports = router;
