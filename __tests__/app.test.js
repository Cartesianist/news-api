const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require("supertest");
const app = require('../app');
const { response } = require('../app');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    describe('GET, 200: returns all topics', () => {
        test('returns an array of 3 objects with the expected keys', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics).toBeInstanceOf(Array);
                    expect(body.topics.length).toBe(3);
                    body.topics.forEach((topic) => {
                        expect(topic).toBeInstanceOf(Object);
                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        });
                    });
                });
        });
    });
});

describe("/api/users", () => {
    describe('GET, 200: returns all Users', () => {
        test('returns an array of 4 objects with the expected keys', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    expect(body.users).toBeInstanceOf(Array);
                    expect(body.users.length).toBe(4);
                    body.users.forEach((user) => {
                        expect(user).toBeInstanceOf(Object);
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String),
                        });
                    });
                });
        });
    });
});

describe("/api/articles", () => {
    describe('GET, 200: returns all articles', () => {
        test('returns an array of 12 objects with the expected keys', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array);
                    expect(body.articles.length).toBe(12);
                    body.articles.forEach((article) => {
                        expect(article).toBeInstanceOf(Object);
                        expect(article).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String)
                        });
                    });
                });
        });
        test('sort by date in desc order when no query provided', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        descending: true,
                    });
                });
        });
        test('return by topic', () => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles.length).toBe(1);
                    body.articles.forEach((article) => {
                        expect(article.topic).toBe("cats");
                    })
                })
        });
    });
    describe('endpoint should accept the queries: sort_by and order', () => {
        test('should default sort articles by date descending', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        descending: true
                    })
                })
        })
        test('should sort articles by a specified column when sort_by query is present descending by default', () => {
            return request(app)
                .get('/api/articles?sort_by=topic')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("topic", {
                        descending: true
                    })
                })
        })
        test('should sort articles in ascending order when order query is set to asc', () => {
            return request(app)
                .get('/api/articles?order=asc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        ascending: true
                    })
                })
        })
        test('should sort articles by a specified column when sort_by query is present', () => {
            return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("author", {
                        ascending: true
                    })
                })
        })
    })
});

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test("200: returns specific article", () => {
            return request(app)
                .get(`/api/articles/1`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toBeInstanceOf(Object);
                    expect(body.article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 100,
                        comment_count: "11"
                    });
                })
        });
        test("400: bad request", () => {
            return request(app)
                .get(`/api/articles/long`)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: 'Invalid input' })
                });
        });
        test('404: article not found', () => {
            return request(app)
                .get(`/api/articles/418`)
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: 'Article not found' })
                });
        });
    });
    describe("PATCH", () => {
        test("200: updates votes and responds with updated object", () => {
            const votes = {
                inc_votes: 2,
            };
            return request(app)
                .patch(`/api/articles/1`)
                .send(votes)
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 102
                    });
                    return db.query("SELECT * FROM articles WHERE article_id=1");
                })
                .then(({ rows }) => {
                    expect(rows[0]).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.anything(),
                        votes: 102
                    });
                });
        });
        test('400: Invalid input', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Invalid input" });
                    return db.query("SELECT * FROM articles WHERE article_id=1");
                })
                .then(({ rows }) => {
                    expect(rows[0]).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.anything(),
                        votes: 100
                    });
                });
        });
        test('400: Invalid input', () => {
            const votes = {
                inc_votes: 'two',
            };
            return request(app)
                .patch('/api/articles/1')
                .send(votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Invalid input" });
                    return db.query("SELECT * FROM articles WHERE article_id=1"
                    );
                })
                .then(({ rows }) => {
                    expect(rows[0]).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.anything(),
                        votes: 100
                    });
                });
        });
        test("400: bad request", () => {
            const votes = {
                inc_votes: 2,
            };
            return request(app)
                .patch(`/api/articles/one`)
                .send(votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: 'Invalid input' })
                });
        });
        test('404: article not found', () => {
            const votes = {
                inc_votes: 2,
            };
            return request(app)
                .patch(`/api/articles/418`)
                .send(votes)
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: 'Article not found' })
                });
        });
    });
});

describe("/api/articles/:article_id/comments", () => {
    describe('GET, 200: returns all comments with a particular article id', () => {
        test('returns an array', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                });
        })
        test('returns an array of 12 objects with the expected keys', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                    expect(body.comments.length).toBe(11);
                    body.comments.forEach((comment) => {
                        expect(comment).toBeInstanceOf(Object);
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        });
                    });
                });
        });
    });
    test("400: bad request", () => {
        return request(app)
            .get(`/api/articles/long/comments`)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid input' })
            });
    });
    test('404: Comments not found', () => {
        return request(app)
            .get(`/api/articles/418/comments`)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Comments not found' })
            });
    });
    describe('POST, 201: returns new comment added to the database', () => {
        test('returns the new comment and also adds it to the database', () => {
            const newComment = {
                username: 'butter_bridge',
                body: 'butter under the bridge'
            };
            return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body.comment).toMatchObject({
                        article_id: 1,
                        comment_id: 19,
                        author: 'butter_bridge',
                        body: 'butter under the bridge',
                        created_at: expect.any(String),
                        votes: 0,
                    });

                    return db.query(" SELECT * FROM comments WHERE comment_id=19");
                })
                .then((res) => {
                    expect(res.rows[0])
                })
        })
        test("400: error when passed empty object", () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Invalid input" });
                });
        });
        test('400: returns an error when passed invalid properties', () => {
            const input = {
                username: "The Codfather",
                body: "two",
            };
            return request(app)
                .post('/api/articles/1/comments')
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Invalid input" });
                })
        })
    })
});

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("204: returns no content and removes the comment from the Database", () => {
            const deletedCommentID = 5;
            return request(app)
                .delete(`/api/comments/${deletedCommentID}`)
                .expect(204)
                .then(() => {
                    return db.query("SELECT * FROM comments WHERE comment_id=$1;", [deletedCommentID]);
                })
                .then((res) => {
                    expect(res.rows.length).toBe(0)
                })
                .then(() => {
                    return db.query("SELECT * FROM comments WHERE comment_id=1;")
                })
                .then((res) => {
                    expect(res.rows[0]).toMatchObject({
                        article_id: 9,
                        comment_id: 1,
                        author: 'butter_bridge',
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        created_at: expect.any(Date),
                        votes: 16,
                    });
                });
        });
        test("404: id is valid but does not exist", () => {
            return request(app)
                .delete("/api/comments/9999")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: 'Comment not found' })
                })
        })
    });
});