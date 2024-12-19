const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');


const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // Количество на складе
    priceVariants: {
        type: DataTypes.JSON, // Хранение ценовых вариантов в формате JSON
        allowNull: true
    },
    country: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageLink: { type: DataTypes.TEXT, allowNull: true, defaultValue: 'https://images.unsplash.com/photo-1487646709898-58d3c6e8d886?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, // URL изображения
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }, // Активен/неактивен
});

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerName: { type: DataTypes.STRING, allowNull: false }, // Имя покупателя
    phone: { type: DataTypes.STRING, allowNull: false }, // Телефон
    address: { type: DataTypes.STRING, allowNull: false }, // Адрес доставки
    email: { type: DataTypes.STRING, allowNull: false }, // Адрес доставки
    items: { type: DataTypes.JSONB, allowNull: false }, // Общая стоимость заказа
    totalAmount: { type: DataTypes.FLOAT, allowNull: false }, // Общая стоимость заказа
    totalQuantity: { type: DataTypes.INTEGER, allowNull: false }, // Общая стоимость заказа
    paymentStatus: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
        defaultValue: 'Pending'
    }, // Статус оплаты
});

const Admin = sequelize.define('admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }, // Пароль в хешированном виде
    role: { type: DataTypes.STRING, defaultValue: 'ADMIN' },
});

const Payment = sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    paymentId: { type: DataTypes.STRING, unique: true }, // ID платежа в Тинькофф
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'INIT' }, // Статус платежа
    amount: { type: DataTypes.FLOAT, allowNull: false }, // Сумма платежа
});

module.exports = {
    Product,
    Order,
    Admin,
    Category
}