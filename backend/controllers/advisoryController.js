const db = require('../config/db');

// Create article (admin or cooperative)
exports.createArticle = async (req, res) => {
  if (!['admin', 'cooperative'].includes(req.user.user_type)) return res.status(403).json({ message: 'Access denied' });

  const { title, content, category } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO advisory_services (title, content, category, author_id) VALUES (?, ?, ?, ?)',
      [title, content, category, req.user.user_id]
    );
    res.status(201).json({ article_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create article' });
  }
};

// Get all articles (with optional category filter)
exports.getAllArticles = async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT a.*, u.full_name AS author_name FROM advisory_services a JOIN users u ON a.author_id = u.user_id';
  const params = [];
  if (category) {
    query += ' WHERE a.category = ?';
    params.push(category);
  }
  query += ' ORDER BY a.created_at DESC';

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single article
exports.getArticleById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT a.*, u.full_name AS author_name FROM advisory_services a JOIN users u ON a.author_id = u.user_id WHERE a.article_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Article not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update article (author or admin)
exports.updateArticle = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const [article] = await db.execute('SELECT author_id FROM advisory_services WHERE article_id = ?', [req.params.id]);
    if (article.length === 0) return res.status(404).json({ message: 'Article not found' });
    if (article[0].author_id !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.execute(
      'UPDATE advisory_services SET title = ?, content = ?, category = ? WHERE article_id = ?',
      [title, content, category, req.params.id]
    );
    res.json({ message: 'Article updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete article (author or admin)
exports.deleteArticle = async (req, res) => {
  try {
    const [article] = await db.execute('SELECT author_id FROM advisory_services WHERE article_id = ?', [req.params.id]);
    if (article.length === 0) return res.status(404).json({ message: 'Article not found' });
    if (article[0].author_id !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.execute('DELETE FROM advisory_services WHERE article_id = ?', [req.params.id]);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};