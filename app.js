const express = require("express");
const app = express();
const { getTopics } = require('./controllers/topics.controllers');
const { getArticle } = require('./controllers/articles.controllers');



app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
    const badRequestCodes = ['22P02']
    if (badRequestCodes.includes(err.code)) {
        res.status(400).send({ msg: "Invalid input" })
    }
    else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    if (err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err, "<< uncaught error");
    res.status(500).send({ msg: "internal server error" });
});

module.exports = app;