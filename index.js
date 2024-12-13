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
    const cors = require('cors');
    const router = require('./routes/index');

    const app = express();

    app.use('/static', express.static('static'));
    app.use(cors());
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