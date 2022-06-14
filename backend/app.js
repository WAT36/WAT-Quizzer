var express = require("express");

var app = express();
app.get("/", (req, res) => {
    res.status(200).send("Express!!");
});

// ポート7000番でlistenする
app.listen(7000);