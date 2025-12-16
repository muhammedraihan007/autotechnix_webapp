const mongoose = require('mongoose');
const InventorySchema = new mongoose.Schema({
  partName: String,
  partCode: { type: String, unique: true, sparse: true },
  price: Number,
  stock: Number,
  lowStockWarning: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Inventory', InventorySchema);
