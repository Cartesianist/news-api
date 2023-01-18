const { fetchComments } = require('../models/comments.models');

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    return fetchComments(article_id)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next);
}