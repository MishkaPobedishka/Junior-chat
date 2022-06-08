require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json())

const startServer = async () => {
    try {
        app.listen(PORT, () =>
            console.log(`Server start at port ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

startServer();

app.get("/", (req, res) => {
    res.send("Hi from server");
})