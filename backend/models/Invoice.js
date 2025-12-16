const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  invoiceNo: { type: String, unique: true },
  lineItems: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  partsTotal: Number,
  labourTotal: Number,
  taxes: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  filePath: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Invoice', InvoiceSchema);
