const { Admin } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AdminController {
    // Авторизация
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const admin = await Admin.findOne({ where: { username } });
            if (!admin) return res.status(404).json({ message: 'Администратор не найден' });

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Неверный пароль' });

            const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.SECRET_KEY, { expiresIn: '10000h' });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка при авторизации', error: err.message });
        }
    }

    // Смена пароля
    async changePassword(req, res) {
        const { id } = req.admin; // ID из токена
        const { oldPassword, newPassword } = req.body;
        try {
            const admin = await Admin.findByPk(id);
            if (!admin) return res.status(404).json({ message: 'Администратор не найден' });

            const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Старый пароль неверный' });

            admin.password = await bcrypt.hash(newPassword, 10);
            await admin.save();
            res.json({ message: 'Пароль успешно обновлён' });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка при смене пароля', error: err.message });
        }
    }
}

module.exports = new AdminController();
