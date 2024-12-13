const TinkoffService = require('../service/bankService');
const Payment = require('../models/models');

class PaymentController {
    // Инициализация платежа
    async initPayment(req, res) {
        const { orderId, amount, description } = req.body;

        try {
            const redirectUrl = 'https://your-site.com/payment/success';
            const notificationUrl = 'https://your-site.com/payment/callback';

            const paymentData = await TinkoffService.createPayment(orderId, amount, description, redirectUrl, notificationUrl);

            // Сохраняем данные платежа в базе
            await Payment.create({
                orderId,
                paymentId: paymentData.PaymentId,
                status: 'INIT',
                amount,
            });

            res.json({ paymentUrl: paymentData.PaymentURL });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при инициализации платежа' });
        }
    }

    // Обработка callback от Тинькофф
    async handleCallback(req, res) {
        const { OrderId, Status, PaymentId } = req.body;

        try {
            // Проверяем подпись
            if (!TinkoffService.verifyToken(req.body)) {
                return res.status(400).json({ message: 'Invalid Token' });
            }

            // Обновляем статус платежа в базе
            const payment = await Payment.findOne({ where: { paymentId: PaymentId } });
            if (!payment) {
                return res.status(404).json({ message: 'Платеж не найден' });
            }

            payment.status = Status;
            await payment.save();

            res.status(200).send('OK');
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обработке уведомления' });
        }
    }
}

module.exports = new PaymentController();
