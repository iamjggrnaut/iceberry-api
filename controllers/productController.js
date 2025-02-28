const { sendNewProductNotification } = require("../../bot/shop-bot");
const { Product, Category } = require("../models/models");

class ProductController {
  // Получить список всех продуктов
  async getAll(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }

  async getByCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ where: { id } });
      const products = await Product.findAll({
        where: { category: category.dataValues.name },
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }

  // Получить продукт по ID
  async getOne(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ message: "Продукт не найден" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }

  // Создать новый продукт
  async create(req, res) {
    const {
      name,
      category,
      stock,
      priceVariants,
      country,
      description,
      imageLink,
    } = req.body;
    console.log("Создание нового продукта", req.body); // Логируем входные данные

    try {
      const product = await Product.create({
        name,
        category,
        stock,
        priceVariants,
        country,
        description,
        imageLink,
      });
      console.log("Создан продукт:", product); // Логируем созданный продукт

      await sendNewProductNotification(product);
      res.status(201).json(product);
    } catch (err) {
      console.error("Ошибка при создании продукта:", err.message); // Логируем ошибку
      res
        .status(500)
        .json({ message: "Ошибка при создании продукта", error: err.message });
    }
  }

  // Обновить продукт
  async update(req, res) {
    const { id } = req.params;
    const { name, priceVariants, country, description, imageLink } = req.body;

    try {
      const product = await Product.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      // Всегда обновляем все поля, если они присутствуют
      await product.update({
        name,
        priceVariants,
        country,
        description,
        imageLink,
      });

      res.json(product);
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Ошибка при обновлении продукта",
          error: err.message,
        });
    }
  }

  // Удалить продукт
  async delete(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ message: "Продукт не найден" });
      await product.destroy();
      res.json({ message: "Продукт успешно удалён" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при удалении продукта", error: err.message });
    }
  }
}

module.exports = new ProductController();
