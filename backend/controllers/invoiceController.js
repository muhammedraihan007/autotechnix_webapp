const Invoice = require('../models/Invoice');
const generateInvoice = require('../utils/generateInvoice');
const path = require('path');

exports.createManualInvoice = async (req, res) => {
  try {
    const { job, lineItems, taxes, discount, total } = req.body;

    // Generate a unique invoice number
    const invoiceNo = `INV-${Date.now()}`;
    const filePath = path.join(__dirname, '..', 'uploads', 'invoices', `${invoiceNo}.pdf`);

    const invoiceData = {
      job,
      invoiceNo,
      lineItems,
      taxes,
      discount,
      total,
      filePath,
      createdAt: new Date()
    };

    // Save invoice to database
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    // Generate PDF
    await generateInvoice(invoiceData, filePath);

    res.status(201).json({
      msg: 'Invoice created successfully',
      invoice: newInvoice,
      filePath: `uploads/invoices/${invoiceNo}.pdf`
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};