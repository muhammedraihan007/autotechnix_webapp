const User = require('../models/User');

exports.getProfile = async (req,res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.listCustomers = async (req,res) => {
  const users = await User.find({ role: 'customer' }).select('-password');
  res.json(users);
};
