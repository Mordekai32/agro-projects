const express = require('express');
const { createTransaction, getMyTransactions, getAllTransactions } = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createTransaction);
router.get('/me', auth, getMyTransactions);
router.get('/all', auth, getAllTransactions);

module.exports = router;