const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate PDF order sheet
 */
exports.generateOrderPDF = async (orderData) => {
    return new Promise((resolve, reject) => {
        try {
            // Create directory structure: /backend/bahnhof/<location>/<year>/<month>/
            const date = new Date(orderData.order_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const locationName = orderData.location_name.toLowerCase().replace(/\s+/g, '-');
            
            const dirPath = path.join(
                __dirname,
                '..',
                'bahnhof',
                locationName,
                String(year),
                month
            );
            
            // Create directories if they don't exist
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            // Create filename: order_<orderId>_<date>.pdf
            const filename = `order_${orderData.order_id}_${year}-${month}-${day}.pdf`;
            const filePath = path.join(dirPath, filename);
            
            // Create PDF document
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            
            // Pipe to file
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);
            
            // Header
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .text('BESTELLSYSTEM', 50, 50, { align: 'center' });
            
            doc.fontSize(16)
               .font('Helvetica')
               .text('Bestellschein', 50, 85, { align: 'center' });
            
            // Line separator
            doc.moveTo(50, 110)
               .lineTo(550, 110)
               .stroke();
            
            // Order Information
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text('Bestellinformationen', 50, 130);
            
            doc.fontSize(10)
               .font('Helvetica')
               .text(`Bestellnummer: ${orderData.order_id}`, 50, 155)
               .text(`Standort: ${orderData.location_name}`, 50, 175)
               .text(`Datum: ${formatDate(orderData.order_date)}`, 50, 195)
               .text(`Uhrzeit: ${orderData.order_time}`, 50, 215)
               .text(`Erstellt von: ${orderData.created_by}`, 50, 235);
            
            if (orderData.notes) {
                doc.text(`Notizen: ${orderData.notes}`, 50, 255);
            }
            
            // Line separator
            doc.moveTo(50, 280)
               .lineTo(550, 280)
               .stroke();
            
            // Items Table Header
            const tableTop = 300;
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text('Bestellte Artikel', 50, tableTop);
            
            // Table headers
            const itemTableTop = tableTop + 30;
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .text('Pos.', 50, itemTableTop)
               .text('Artikelname', 90, itemTableTop)
               .text('Verpackung', 300, itemTableTop)
               .text('Menge', 430, itemTableTop, { width: 60, align: 'right' });
            
            // Draw header line
            doc.moveTo(50, itemTableTop + 15)
               .lineTo(550, itemTableTop + 15)
               .stroke();
            
            // Items
            let yPosition = itemTableTop + 25;
            let totalQuantity = 0;
            
            doc.font('Helvetica');
            
            orderData.items.forEach((item, index) => {
                totalQuantity += item.quantity;
                
                doc.text(`${index + 1}`, 50, yPosition)
                   .text(item.product_name, 90, yPosition, { width: 200 })
                   .text(item.packaging || '-', 300, yPosition, { width: 120 })
                   .text(String(item.quantity), 430, yPosition, { width: 60, align: 'right' });
                
                yPosition += 25;
                
                // Add new page if needed
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }
            });
            
            // Summary line
            doc.moveTo(50, yPosition)
               .lineTo(550, yPosition)
               .stroke();
            
            yPosition += 15;
            
            doc.fontSize(11)
               .font('Helvetica-Bold')
               .text('Gesamtmenge:', 300, yPosition)
               .text(String(totalQuantity), 430, yPosition, { width: 60, align: 'right' });
            
            // Footer
            doc.fontSize(8)
               .font('Helvetica')
               .text(
                   `Erstellt am: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}`,
                   50,
                   750,
                   { align: 'center' }
               );
            
            // Finalize PDF
            doc.end();
            
            writeStream.on('finish', () => {
                const relativePath = path.relative(path.join(__dirname, '..'), filePath);
                console.log(`✅ PDF generated: ${relativePath}`);
                resolve(relativePath);
            });
            
            writeStream.on('error', (error) => {
                console.error('❌ PDF generation error:', error);
                reject(error);
            });
            
        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            reject(error);
        }
    });
};

/**
 * Format date to DD.MM.YYYY
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
