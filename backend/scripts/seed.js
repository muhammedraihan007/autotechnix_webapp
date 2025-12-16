const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

(async ()=>{
  try{
    await connectDB();
    await User.deleteMany({});
    await Inventory.deleteMany({});
    const adminPass = await bcrypt.hash('adminpass', 10);
    const admin = new User({ username: 'admin', name: 'Admin', phone: '+911234567890', password: adminPass, role: 'admin' });
    await admin.save();
    const custPass = await bcrypt.hash('custpass', 10);
    const cust = new User({ username: 'customer', name: 'Customer', phone: '+911111111111', password: custPass, role: 'customer' });
    await cust.save();
    await Inventory.create({ partName: 'Brake Pad', partCode: 'BP100', price: 1500, stock: 20 });
    await Inventory.create({ partName: 'Oil Filter', partCode: 'OF200', price: 400, stock: 50 });
    console.log('Seeded admin and customer');
    process.exit();
  }catch(e){ console.error(e); process.exit(1); }
})();
