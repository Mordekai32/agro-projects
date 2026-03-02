const db = require('../config/db');

// Create a transaction (buyer buys a product)
exports.createTransaction = async (req, res) => {
  if (req.user.user_type !== 'buyer') return res.status(403).json({ message: 'Only buyers can purchase' });

  const { product_id, quantity_bought } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Get product details
    const [productRows] = await connection.execute(
      'SELECT price_per_unit, quantity_available, farmer_id FROM products WHERE product_id = ?',
      [product_id]
    );
    if (productRows.length === 0) throw new Error('Product not found');
    const product = productRows[0];
    if (product.quantity_available < quantity_bought) throw new Error('Insufficient quantity');

    const total_price = product.price_per_unit * quantity_bought;
    const commission_fee = total_price * 0.025; // 2.5% commission

    // Insert transaction
    const [txResult] = await connection.execute(
      'INSERT INTO transactions (buyer_id, product_id, quantity_bought, total_price, commission_fee, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.user_id, product_id, quantity_bought, total_price, commission_fee, 'completed']
    );

    // Update product quantity
    await connection.execute(
      'UPDATE products SET quantity_available = quantity_available - ? WHERE product_id = ?',
      [quantity_bought, product_id]
    );

    await connection.commit();
    res.status(201).json({ transaction_id: txResult.insertId, total_price, commission_fee });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
};

// Get transactions for the logged-in user (buyer sees own purchases, farmer sees sales)
exports.getMyTransactions = async (req, res) => {
  let query;
  let params = [req.user.user_id];
  if (req.user.user_type === 'buyer') {
    query = `SELECT t.*, p.product_name, u.full_name AS seller_name
             FROM transactions t
             JOIN products p ON t.product_id = p.product_id
             JOIN users u ON p.farmer_id = u.user_id
             WHERE t.buyer_id = ?
             ORDER BY t.transaction_date DESC`;
  } else if (req.user.user_type === 'farmer') {
    query = `SELECT t.*, p.product_name, u.full_name AS buyer_name
             FROM transactions t
             JOIN products p ON t.product_id = p.product_id
             JOIN users u ON t.buyer_id = u.user_id
             WHERE p.farmer_id = ?
             ORDER BY t.transaction_date DESC`;
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
  if (req.user.user_type !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const [rows] = await db.execute(`
      SELECT t.*, buyer.full_name AS buyer_name, seller.full_name AS seller_name, p.product_name
      FROM transactions t
      JOIN products p ON t.product_id = p.product_id
      JOIN users buyer ON t.buyer_id = buyer.user_id
      JOIN users seller ON p.farmer_id = seller.user_id
      ORDER BY t.transaction_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};