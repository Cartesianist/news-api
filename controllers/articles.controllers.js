const { fetchArticle } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    return fetchArticle(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
};;
