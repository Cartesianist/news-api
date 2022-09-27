const db = require('../db/connection');
const format = require('pg-format');

exports.fetchArticle = (article_id) => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id]
    ).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article not found' })
        }
        return rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, article_id]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article not found' })
        }
        return rows[0];
    });
}

exports.fetchArticles = (topic) => {
    let query =
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id`;
    const queryValues = [];

    if (topic) {
        query += ` WHERE articles.topic=$1`;
        queryValues.push(topic);
    }

    query += ` GROUP BY articles.article_id
        ORDER BY created_at ASC;`;

    return db.query(query, queryValues).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Articles not found' })
        }
        return rows;
    });
}