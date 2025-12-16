const Inventory = require('../models/Inventory');

exports.addPart = async (req,res) => {
  const { partName, partCode, price, stock } = req.body;
  const p = new Inventory({ partName, partCode, price, stock });
  await p.save();
  res.json(p);
};

// supports ?page=1&pageSize=10
exports.listParts = async (req,res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;
  const total = await Inventory.countDocuments();
  const parts = await Inventory.find().skip(skip).limit(pageSize).sort({ createdAt: -1 });
  res.json({ total, page, pageSize, parts });
};
