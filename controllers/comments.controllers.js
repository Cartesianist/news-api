const { fetchComments, createComment, removeComment } = require('../models/comments.models');

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    return fetchComments(article_id)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next);
}
exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;
    return createComment(newComment, article_id)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next);
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id).then(() => {
        res.status(204).send();
    }).catch(next);
};