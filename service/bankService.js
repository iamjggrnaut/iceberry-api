const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/bankConfig');

class TinkoffService {
    static generateToken(data) {
        const tokenData = Object.keys(data)
            .filter((key) => key !== 'Token' && data[key] !== undefined && data[key] !== null)
            .sort()
            .reduce((acc, key) => acc + data[key], '') + config.password;

        return crypto.createHash('sha256').update(tokenData).digest('hex');
    }

    static async createPayment(orderId, amount, description, redirectUrl, notificationUrl) {
        const requestData = {
            TerminalKey: config.terminalKey,
            OrderId: orderId,
            Amount: amount * 100, // Сумма в копейках
            Description: description,
            SuccessURL: redirectUrl,
            NotificationURL: notificationUrl,
        };

        requestData.Token = this.generateToken(requestData);

        try {
            const response = await axios.post(`${config.apiUrl}/Init`, requestData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании платежа:', error.response?.data || error.message);
            throw error;
        }
    }

    static verifyToken(data) {
        const tokenData = Object.keys(data)
            .filter((key) => key !== 'Token' && data[key] !== undefined && data[key] !== null)
            .sort()
            .reduce((acc, key) => acc + data[key], '') + config.password;

        const expectedToken = crypto.createHash('sha256').update(tokenData).digest('hex');
        return expectedToken === data.Token;
    }
}

module.exports = TinkoffService;
