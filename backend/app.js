const express = require("express");
const dotenv = require("dotenv");
const path = require('path');

const env = dotenv.config({path: path.join(__dirname, "../config/.env")})

var app = express();
app.get("/", (req, res) => {
    res.status(200).send("Express!!");
});

app.get("/namelist", (req, res) => {
    res.status(200).send(process.env.TEST);
});

// ポート7000番でlistenする
app.listen(7000);