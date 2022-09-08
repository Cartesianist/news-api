const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require("supertest");
const app = require('../app');

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
                        votes: 100
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
// describe("/api/articles", () => {
//     describe('GET, 200: returns all articles', () => {
//         test('returns an array of 3 objects with the expected keys', () => {
//             return request(app)
//                 .get('/api/articles')
//                 .expect(200)
//                 .then(({ body }) => {
//                     expect(body.articles).toBeInstanceOf(Array);
//                     expect(body.articles.length).toBe(12);
//                     body.articles.forEach((article) => {
//                         expect(article).toBeInstanceOf(Object);
//                         expect(article).toMatchObject({
//                             article_id: expect.any(Number),
//                             title: expect.any(String),
//                             topic: expect.any(String),
//                             author: expect.any(String),
//                             body: expect.any(String),
//                             created_at: expect.any(String),
//                             votes: expect.any(Number),
//                             comments: expect.any(Number)
//                         });
//                     });
//                 });
//         });
//     });
// });