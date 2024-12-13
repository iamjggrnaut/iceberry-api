const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/add', orderController.create);
router.get('/all', orderController.getAll); // Только для админа
router.get('/:id', orderController.getOne); // Только для админа
router.put('/:id/payment', orderController.updatePaymentStatus);


module.exports = router;