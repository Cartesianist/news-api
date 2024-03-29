const express = require("express");
const app = express();
const cors = require('cors');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticle, patchArticle, getArticles } = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');
const { getComments, postComment, deleteComment } = require('./controllers/comments.controllers');
const { getJSONInstructions } = require('./controllers/instructions.controllers')

app.use(cors());
app.use(express.json());

app.get('/api', getJSONInstructions);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/users', getUsers);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getComments);
app.post('/api/articles/:article_id/comments', postComment);
app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
    const badRequestCodes = ['22P02', '23502', '23503']
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