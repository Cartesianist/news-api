const db = require('../db/connection');
const format = require('pg-format');

exports.fetchUsers = () => {
    return db.query(
        `SELECT * FROM users`
    )
        .then(({ rows }) => {
            return rows;
        });
};