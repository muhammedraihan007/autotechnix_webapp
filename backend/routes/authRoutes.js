const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('name').notEmpty(),
  body('phone').isLength({ min: 10 })
], async (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, register);

router.post('/login', login);

// Routes for user profile
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

module.exports = router;
