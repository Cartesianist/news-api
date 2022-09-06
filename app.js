const express = require("express");
const app = express();
const { getTopics } = require('./controllers/topics.controllers');


app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    console.log(err, "<< uncaught error");
    res.status(500).send({ msg: "internal server error" });
});

module.exports = app;