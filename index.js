const cluster = require('cluster');
const os = require('os');
const createAdmin = require('./service/utils');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    require('dotenv').config();
    const express = require('express');
    const sequelize = require('./config/db');
    const PORT = process.env.PORT || 5000;

    const fs = require('fs').promises

    const multer = require('multer')
    const upload = multer({ dest: './statics/' })

    const cors = require('cors');
    const router = require('./routes/index');

    const app = express();

    app.use(cors());
    app.use('/statics', express.static('statics'));

    app.post('/api/uploadFile', upload.single('static'), async (req, res) => {
        try {
            const fileType = req.file.mimetype.split('/')[1];
            console.log(fileType);
            if (!fileType) {
                return res.status(400).send('Не удалось получить расширение файла');
            }
            const newName = req.file.filename + '.' + fileType;
            console.log(newName);

            await fs.rename('./statics/' + req.file.filename, './statics/' + newName);
            res.send(newName);
        } catch (err) {
            console.log(err)
            res.status(500).send('Ошибка переименования файла');
        }
    });

    app.use(express.json());
    app.use('/api', router);

    const start = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync();

            await createAdmin();

            app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        } catch (e) {
            console.log(e);
        }
    };

    start();
}