const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.get('/all', productController.getAll);
router.get('/category/:id', productController.getByCategory);
router.get('/:id', productController.getOne);
router.post('/new', checkRoleMiddleware('ADMIN'), productController.create);
router.put('/:id', checkRoleMiddleware('ADMIN'), productController.update);
router.delete('/:id', checkRoleMiddleware('ADMIN'), productController.delete);


module.exports = router;