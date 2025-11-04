-- Database Schema for Warehouse Inventory Ordering System
-- Compatible with SQLite and MySQL

-- ============================================
-- TABLE: categories
-- Stores product categories
-- ============================================
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: subcategories
-- Stores product subcategories
-- ============================================
CREATE TABLE subcategories (
    subcategory_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    subcategory_name VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE(category_id, subcategory_name)
);

-- ============================================
-- TABLE: locations
-- Stores warehouse locations
-- ============================================
CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    location_name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: products
-- Stores product information
-- ============================================
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    packaging VARCHAR(100),
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    unit_price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: orders
-- Stores order header information
-- ============================================
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    location_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    order_time TIME DEFAULT CURRENT_TIME,
    status VARCHAR(50) DEFAULT 'pending',
    total_items INTEGER DEFAULT 0,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE RESTRICT
);

-- ============================================
-- TABLE: order_items
-- Stores individual items within orders
-- ============================================
CREATE TABLE order_items (
    order_item_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_location ON orders(location_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- INITIAL DATA: Insert locations
-- ============================================
INSERT INTO locations (location_name, city, is_active) VALUES
('Bregenz', 'Bregenz', TRUE),
('Dornbirn', 'Dornbirn', TRUE),
('Feldkirch', 'Feldkirch', TRUE),
('Bludenz', 'Bludenz', TRUE);