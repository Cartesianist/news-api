const db = require('../db/connection');

exports.fetchComments = (article_id) => {
    return db.query(
        `SELECT comments.comment_id, comments.author, comments.body, comments.created_at, comments.votes 
        FROM comments
        Where comments.article_id = $1`, [article_id]
    ).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Comments not found' })
        }
        return rows;
    });
}