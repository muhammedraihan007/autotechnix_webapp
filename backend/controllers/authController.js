const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {
  try {
    const { username, name, phone, password } = req.body;
    let user = await User.findOne({ username });
    if(user) return res.status(400).json({ msg: 'Username taken' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username, name, phone, password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch(err){
    console.error(err); res.status(500).send('Server error');
  }
};

exports.login = async (req,res) => {
  console.log('Login request received, body:', req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ msg: 'Invalid creds' });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ msg: 'Invalid creds' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
};

// Get current user's profile
exports.getMe = async (req, res) => {
  try {
    // req.user.id is available from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update user profile
exports.updateMe = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update name and phone if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
      }
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    // Return updated user data, excluding password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
