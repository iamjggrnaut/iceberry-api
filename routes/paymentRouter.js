const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Инициализация платежа
router.post('/init', paymentController.initPayment);

// Callback от Тинькофф
router.post('/callback', paymentController.handleCallback);

module.exports = router;
