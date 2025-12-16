const mongoose = require('mongoose');
const WarrantySchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  warrantyPeriodMonths: Number,
  warrantyExpiryDate: Date,
  warrantyTerms: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Warranty', WarrantySchema);
