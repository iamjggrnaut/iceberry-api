const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.get('/all', categoryController.getAll);
router.post('/new', categoryController.create);
router.delete('/:id', categoryController.delete);
router.get('/:id', categoryController.getOne);


module.exports = router;