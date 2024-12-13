const { Admin } = require('../models/models')
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    const adminUsername = process.env.ADMIN_USERNAME || 'icedadminshop';
    const adminPassword = process.env.ADMIN_PASSWORD || '!besticedshop2025';

    const admin = await Admin.findOne({ where: { role: 'ADMIN' } });

    if (!admin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 5); // Хэширование пароля
        await Admin.create({
            username: adminUsername,
            password: hashedPassword,
            role: 'ADMIN',
        });
        console.log('Admin user created');
    } else {
        console.log('Admin user already exists');
    }
};


module.exports = createAdmin