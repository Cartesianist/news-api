const { fetchArticle, commentCount } = require('../models/articles.models');

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([fetchArticle(article_id), commentCount(article_id)]).then(([article, count]) => {
        article.comments = parseInt(count);
        res.status(200).send({ article })
    }).catch(next);
};
