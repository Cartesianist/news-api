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

exports.commentCount = (article_id) => {
    return db.query(
        `SELECT COUNT(*) FROM comments
        WHERE article_id=$1;`, [article_id]
    ).then(({ rows }) => {
        return rows[0].count;
    })
}