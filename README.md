You are my Lead Developer and Lead Designer for a web-based inventory ordering system for cleaning chemicals. Please develop a complete web project based on the following requirements:

**Goal:**  
Create a simple and user-friendly ordering system for employees at four locations (Bregenz, Dornbirn, Feldkirch, Bludenz) to request cleaning products from a central warehouse.

**Frontend:**  
- A separate input form per location (selectable via dropdown or URL parameter)
- Product list should include:
  - Product image
  - Product name
  - Description
  - Packaging size
  - Input field for quantity to order
- Clean, responsive design using HTML, CSS, and JavaScript (or optionally React)

**Backend:**  
- Store submitted orders in a database (e.g. SQLite or MySQL)
- Automatically generate an order sheet (PDF) after submission
- Save the PDF in a backend folder structure like `/backend/bahnhof/<location>/<date>.pdf`

**Data Source:**  
Product data is provided in an Excel file with the following columns:
- Image
- Product Name
- Clustered Product Name
- Category
- Subcategory
- Description
- Packaging

Use this data as the basis for the product list in the frontend. You may convert it to JSON or import it into the database.

**Technologies:**  
- HTML, CSS, JavaScript (or React)
- Backend in Node.js or Python (e.g. Flask)
- Database: SQLite or MySQL
- PDF generation using a suitable library (e.g. jsPDF, Puppeteer, or ReportLab)

Please deliver:
1. Database schema
2. Frontend layout and logic
3. Backend logic for order processing
4. PDF generation and file saving
5. (Optional) Admin view to review all orders

Comment the code clearly and structure the project for easy future expansion.
