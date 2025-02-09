const { Order } = require("../models/models");
const { OrderItem } = require("../models/models");
const { Product } = require("../models/models");

class OrderController {
  // Оформить заказ
  async create(req, res) {
    const {
      customerName,
      phone,
      address,
      email,
      items,
      totalAmount,
      totalQuantity,
    } = req.body;
    try {
      const order = await Order.create({
        customerName,
        phone,
        address,
        email,
        items,
        totalAmount,
        totalQuantity,
      });
      res.status(201).json(order);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при создании заказа", error: err.message });
    }
  }

  // Получить все заказы (для администратора)
  async getAll(req, res) {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }

  async getOne(req, res) {
    const { id } = req.params;

    try {
      const orders = await Order.findOne({ where: { id } });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }

  // Обновить статус оплаты заказа
  async updatePaymentStatus(req, res) {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    try {
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Заказ не найден" });
      order.paymentStatus = paymentStatus;
      await order.save();
      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: "Ошибка при обновлении статуса оплаты",
        error: err.message,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const order = await Order.destroy({ where: { id } });
      if (!order) return res.status(404).json({ message: "Заказ не найден" });

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: "Ошибка при обновлении статуса оплаты",
        error: err.message,
      });
    }
  }
}

module.exports = new OrderController();
