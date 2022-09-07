const db = require('../db/connection');
const format = require('pg-format');

exports.fetchArticle = (article_id) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1;`, [article_id]
    ).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article not found' })
        }
        return rows[0];
    });
};

exports.updateArticle = (article_id, votes) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [votes, article_id]).then((res) => {
        return res.rows[0];
    })
}