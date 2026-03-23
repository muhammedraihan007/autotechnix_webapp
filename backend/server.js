require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/cars',      require('./routes/carRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/invoices',  require('./routes/invoiceRoutes'));
app.use('/api/jobs',      require('./routes/jobRoutes'));
app.get('/api/health', (_, res) => res.json({ ok: true }));
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB connected'); app.listen(process.env.PORT || 5000, () => console.log('🚀 API on http://localhost:' + (process.env.PORT || 5000))); })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
