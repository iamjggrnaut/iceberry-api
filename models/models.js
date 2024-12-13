const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');


const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // Количество на складе
    retailPrice: { type: DataTypes.FLOAT, allowNull: false },
    wholesalePrice: { type: DataTypes.FLOAT, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageLink: { type: DataTypes.STRING, allowNull: false }, // URL изображения
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