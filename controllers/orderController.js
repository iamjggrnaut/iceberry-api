const { Order } = require("../models/models");
const { OrderItem } = require("../models/models");
const { Product } = require("../models/models");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "iceberryshop@internet.ru",
    pass: "HmpGvxzHKsAZaVdyy750",
  },
});

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

      if (items && items.length) {
        console.log("ITEMS UPDATE");

        for (let i in items) {
          const product = await Product.findOne({ where: { id: items[i].id } });
          await product.update({
            stock:
              product.dataValues.stock -
              items[i].priceVariant.weight * items[i].quantity,
          });
        }
      }

      const email = "";

      let result = await transporter.sendMail({
        from: "radar-analytica@inbox.ru",
        to: email,
        subject: "Подтверждение регистрации",
        text: "Данное письмо отправлено сервисом «Radar Analytica».",
        html: `<div style="padding: 1rem; background-color: white; width: 100%; ">
            <div style="padding: 1rem; max-width: 560px; ">
                <img src="cid:unique-image-id" alt="Изображение" style="width: 200px;">
                <h1>Здравствуйте!</h1>
                <br />
                <p>Вы получили новый заказ. Пройдите в панель админимтратора для ознакомления с заказом</p>
                <br />
                <a href="https://iceberryshop.ru/admin">Панель администратора</a>
            </div>
        </div>`,
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
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Продукт не найден" });
      await order.destroy();
      res.json({ message: "Продукт успешно удалён" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при удалении продукта", error: err.message });
    }
  }
}

module.exports = new OrderController();
