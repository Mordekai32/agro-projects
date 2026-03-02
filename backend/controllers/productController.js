const db = require('../config/db');

// Create a product (farmer only)
exports.createProduct = async (req, res) => {
  const { product_name, category, price_per_unit, quantity_available, image_url, description } = req.body;
  if (req.user.user_type !== 'farmer') return res.status(403).json({ message: 'Access denied' });

  try {
    const [result] = await db.execute(
      'INSERT INTO products (farmer_id, product_name, category, price_per_unit, quantity_available, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.user_id, product_name, category, price_per_unit, quantity_available, image_url, description]
    );
    res.status(201).json({ product_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Product creation failed' });
  }
};

// Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  const { category, farmer_id } = req.query;
  let query = 'SELECT p.*, u.full_name AS farmer_name FROM products p JOIN users u ON p.farmer_id = u.user_id WHERE p.quantity_available > 0';
  const params = [];
  if (category) {
    query += ' AND p.category = ?';
    params.push(category);
  }
  if (farmer_id) {
    query += ' AND p.farmer_id = ?';
    params.push(farmer_id);
  }
  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT p.*, u.full_name AS farmer_name FROM products p JOIN users u ON p.farmer_id = u.user_id WHERE p.product_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product (farmer who owns it only)
exports.updateProduct = async (req, res) => {
  if (req.user.user_type !== 'farmer') return res.status(403).json({ message: 'Access denied' });

  const { product_name, category, price_per_unit, quantity_available, image_url, description } = req.body;
  try {
    // Check ownership
    const [product] = await db.execute('SELECT farmer_id FROM products WHERE product_id = ?', [req.params.id]);
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
    if (product[0].farmer_id !== req.user.user_id) return res.status(403).json({ message: 'Unauthorized' });

    await db.execute(
      'UPDATE products SET product_name = ?, category = ?, price_per_unit = ?, quantity_available = ?, image_url = ?, description = ? WHERE product_id = ?',
      [product_name, category, price_per_unit, quantity_available, image_url, description, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete product (farmer or admin)
exports.deleteProduct = async (req, res) => {
  if (!['farmer', 'admin'].includes(req.user.user_type)) return res.status(403).json({ message: 'Access denied' });

  try {
    if (req.user.user_type === 'farmer') {
      // Check ownership
      const [product] = await db.execute('SELECT farmer_id FROM products WHERE product_id = ?', [req.params.id]);
      if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
      if (product[0].farmer_id !== req.user.user_id) return res.status(403).json({ message: 'Unauthorized' });
    }
    await db.execute('DELETE FROM products WHERE product_id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};