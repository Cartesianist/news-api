
const { fetchArticle, updateArticle, fetchArticles } = require('../models/articles.models');


exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticle(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next);
};
exports.patchArticle = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    return updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
};

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    return fetchArticles(topic, sort_by, order)
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next);
};
