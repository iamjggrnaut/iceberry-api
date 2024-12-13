const { Category } = require('../models/models');

class CategoryController {

    async getAll(req, res) {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    async getOne(req, res) {

        const { id } = req.params;
        try {
            const category = await Category.findOne({ where: { id } });
            res.json(category);
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    async delete(req, res) {

        const { id } = req.params;
        try {
            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Категория не найдена' });
            await category.destroy();
            res.json({ message: 'Категория успешно удалена' });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    async create(req, res) {

        const { name } = req.body

        try {
            const category = await Category.findOne({ where: { name } });
            if (category) {
                res.status(500).json({ message: 'Категория с эти названием уже существует' })
            }
            else {
                const category = await Category.create({ name })
                res.status(201).json(category);
            }
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

}


module.exports = new CategoryController();