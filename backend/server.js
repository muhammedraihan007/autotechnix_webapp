require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO from the external module. This now handles all connection logic.
require('./socket').init(server);

connectDB();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => res.json({ msg: 'AutoTechnix API Running' })); // Health check endpoint
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/job-uploads', require('./routes/jobUploadRoutes'));
app.use('/api/breakdowns', require('./routes/breakdownRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
