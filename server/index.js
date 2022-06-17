require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.SERVER_PORT || 5000;
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error')

const router = require('./router/index')

app.use(cors({
    credentials: true,
    origin:process.env.CLIENT_URL
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', router);

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await app.listen(PORT, () =>
            console.log(`Server start at port ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

startServer();