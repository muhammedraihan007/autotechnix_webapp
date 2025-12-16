const mongoose = require('mongoose');
const CarSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  regNo: { type: String, required: true, unique: true },
  vin: { type: String, required: true, unique: true },
  color: { type: String },
  fuelType: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Car', CarSchema);
