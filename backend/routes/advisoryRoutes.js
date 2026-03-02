const express = require('express');
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controllers/advisoryController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, deleteArticle);

module.exports = router;