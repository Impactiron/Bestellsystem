const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generiert ein Bestellschein-PDF und speichert es nach Standort und Datum
exports.generateOrderPDF = async (orderData) => {
    return new Promise((resolve, reject) => {
        try {
            const date = new Date(orderData.order_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const locationName = orderData.location_name.toLowerCase().replace(/\s+/g, '-');

            const dirPath = path.join(__dirname, '..', 'bahnhof', locationName, year.toString(), month);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const filename = `order_${orderData.order_id}_${year}-${month}-${day}.pdf`;
            const filePath = path.join(dirPath, filename);

            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Header
            doc.fontSize(24).font('Helvetica-Bold').text('BESTELLSYSTEM', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(16).font('Helvetica').text('Bestellschein', { align: 'center' });
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            // Order info
            doc.fontSize(12).font('Helvetica-Bold').text('Bestellinformationen:', 50, doc.y + 20);
            doc.fontSize(10).font('Helvetica')
                .text(`Bestellnummer: ${orderData.order_id}`, 50, doc.y + 15)
                .text(`Standort: ${orderData.location_name}`)
                .text(`Datum: ${formatDate(orderData.order_date)}`)
                .text(`Uhrzeit: ${orderData.order_time}`)
                .text(`Erstellt von: ${orderData.created_by}`);
            if (orderData.notes) {
                doc.text(`Notizen: ${orderData.notes}`);
            }
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            // Table header
            doc.fontSize(12).font('Helvetica-Bold').text('Bestellte Artikel', 50, doc.y + 20);
            let tableTop = doc.y + 15;
            doc.fontSize(10).font('Helvetica-Bold')
                .text('Pos.', 50, tableTop)
                .text('Artikelname', 90, tableTop)
                .text('Verpackung', 280, tableTop)
                .text('Menge', 400, tableTop, { width: 60, align: 'right' });
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Items
            let y = tableTop + 25;
            let totalQty = 0;
            doc.font('Helvetica');
            orderData.items.forEach((item, idx) => {
                totalQty += item.quantity;
                doc.text(`${idx + 1}`, 50, y)
                    .text(item.product_name, 90, y, { width: 180 })
                    .text(item.packaging || '-', 280, y, { width: 90 })
                    .text(String(item.quantity), 400, y, { width: 60, align: 'right' });
                y += 22;
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });

            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += 15;
            doc.fontSize(11).font('Helvetica-Bold').text('Gesamtmenge:', 280, y).text(String(totalQty), 400, y, { width: 60, align: 'right' });

            // Footer
            doc.fontSize(8).font('Helvetica').text(
              `Erstellt am: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}`,
              50,
              750,
              { align: 'center' }
            );

            doc.end();
            writeStream.on('finish', () => {
                const relPath = path.relative(path.join(__dirname, '..'), filePath);
                resolve(relPath);
            });
            writeStream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}