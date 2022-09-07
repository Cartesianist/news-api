const { fetchArticle, updateArticle } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticle(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};;

exports.patchArticle = (req, res, next) => {
    const votes = req.body.inc_votes;
    const { article_id } = req.params;
    return updateArticle(article_id, votes).then((article) => {
        res.status(200).send({ article });
    }).catch(next);
};
