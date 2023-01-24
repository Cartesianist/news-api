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

exports.createComment = (newComment, article_id) => {
    const { username, body } = newComment;
    const created_at = new Date();
    return db.query("INSERT INTO comments (author, body, created_at, votes, article_id) VALUES ($1, $2, $3, 0 , $4) returning *;", [username, body, created_at, article_id]
    )
        .then((comment) => {
            return comment.rows[0]
        });
};

exports.removeComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [comment_id])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Comment not found" })
            }
        })
}