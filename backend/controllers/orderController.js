const db = require('../config/database');
const pdfService = require('../services/pdfService');

// Create new order
exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { location_id, location_name, order_date, order_time, created_by, items, notes } = req.body;

        // Validate required fields
        if (!location_id || !items || items.length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Location and at least one item are required'
            });
        }

        // Insert order header
        const [orderResult] = await connection.query(
            `INSERT INTO orders (location_id, order_date, order_time, status, total_items, notes, created_by)
             VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
            [
                location_id,
                order_date || new Date().toISOString().split('T')[0],
                order_time || new Date().toTimeString().split(' ')[0],
                items.length,
                notes || null,
                created_by || 'system'
            ]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            // Get product details including unit price
            const [productRows] = await connection.query(
                'SELECT unit_price FROM products WHERE product_id = ?',
                [item.product_id]
            );

            const unitPrice = productRows[0]?.unit_price || 0;

            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, notes)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    unitPrice,
                    item.notes || null
                ]
            );
        }

        await connection.commit();

        // Fetch complete order details
        const [orderDetails] = await connection.query(
            `SELECT o.*, l.location_name
             FROM orders o
             JOIN locations l ON o.location_id = l.location_id
             WHERE o.order_id = ?`,
            [orderId]
        );

        const [orderItemsDetails] = await connection.query(
            `SELECT oi.*, p.product_name, p.packaging
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [orderId]
        );

        // Generate PDF
        const pdfPath = await pdfService.generateOrderPDF({
            ...orderDetails[0],
            items: orderItemsDetails
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order_id: orderId,
                location_name: orderDetails[0].location_name,
                order_date: orderDetails[0].order_date,
                total_items: items.length,
                pdf_path: pdfPath
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, l.location_name
             FROM orders o
             JOIN locations l ON o.location_id = l.location_id
             ORDER BY o.created_at DESC`
        );

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const [orders] = await db.query(
            `SELECT o.*, l.location_name
             FROM orders o
             JOIN locations l ON o.location_id = l.location_id
             WHERE o.order_id = ?`,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Order not found'
            });
        }

        const [items] = await db.query(
            `SELECT oi.*, p.product_name, p.packaging
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...orders[0],
                items: items
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Get orders by location
exports.getOrdersByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        const [orders] = await db.query(
            `SELECT o.*, l.location_name
             FROM orders o
             JOIN locations l ON o.location_id = l.location_id
             WHERE o.location_id = ?
             ORDER BY o.created_at DESC`,
            [locationId]
        );

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders by location:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

// Get orders by date range
exports.getOrdersByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const [orders] = await db.query(
            `SELECT o.*, l.location_name
             FROM orders o
             JOIN locations l ON o.location_id = l.location_id
             WHERE o.order_date BETWEEN ? AND ?
             ORDER BY o.created_at DESC`,
            [startDate, endDate]
        );

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders by date range:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};
