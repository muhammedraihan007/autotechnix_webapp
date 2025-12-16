const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(invoiceData, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('AUTOTECHNIX - Workshop Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${invoiceData.invoiceNo}`);
    doc.text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('Description', 40, doc.y, { width: 280 });
    doc.text('Qty', 320, doc.y, { width: 50, align: 'right' });
    doc.text('Unit Price', 370, doc.y, { width: 100, align: 'right' });
    doc.text('Total', 470, doc.y, { width: 100, align: 'right' });
    doc.font('Helvetica');
    doc.moveDown();

    // Table Rows
    invoiceData.lineItems.forEach(item => {
      doc.text(item.description, 40, doc.y, { width: 280 });
      doc.text(item.quantity, 320, doc.y, { width: 50, align: 'right' });
      doc.text(`₹${item.unitPrice.toFixed(2)}`, 370, doc.y, { width: 100, align: 'right' });
      doc.text(`₹${item.total.toFixed(2)}`, 470, doc.y, { width: 100, align: 'right' });
      doc.moveDown();
    });

    doc.moveDown();
    
    // Summary
    if (invoiceData.discount) {
      doc.fontSize(12).text(`Discount: ₹${invoiceData.discount.toFixed(2)}`, { align: 'right' });
    }
    if (invoiceData.taxes) {
      doc.fontSize(12).text(`Taxes: ₹${invoiceData.taxes.toFixed(2)}`, { align: 'right' });
    }
    
    doc.moveDown();
    doc.fontSize(14).font('Helvetica-Bold').text(`Total: ₹${invoiceData.total.toFixed(2)}`, { align: 'right' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = generateInvoice;
