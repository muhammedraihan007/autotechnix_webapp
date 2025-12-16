const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth');
const { createManualInvoice } = require('../controllers/invoiceController');

// @route   POST api/invoices/manual
// @desc    Create a manual invoice and generate a PDF
// @access  Private (Admin)
router.post('/manual', adminOnly, createManualInvoice);

module.exports = router;