const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
complaint: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  audioRecording: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  partsUsed: [{ part: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, qty: Number, price: Number }],
  labourCharge: { type: Number, default: 0 },
  notes: String,
  beforeImages: [String],
  afterImages: [String],
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  warranty: { type: mongoose.Schema.Types.ObjectId, ref: 'Warranty' }
});
module.exports = mongoose.model('Job', JobSchema);
