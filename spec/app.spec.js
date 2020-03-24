process.env.NODE_ENV = "test";
const connection = require("../connection");
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("status 404: will catch any invalid paths after /api", () => {
    return request(app)
      .get("/api/not-a-valid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("invalid pathway");
      });
  });
  describe("/topics", () => {
    describe("GET methods", () => {
      it("status 200: response object is an object in an array with the correct key and array has the correct length", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).to.equal(3);
            expect(topics[0]).to.be.an("object");
            expect(topics[0]).to.contains.keys("slug", "description");
          });
      });
    });
    describe("invalids methods", () => {
      it("status 405: methods not allowed", () => {
        const invalidMethods = ["post", "delete", "put", "patch"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
  });
  describe("/users", () => {
    describe("invalids methods", () => {
      it("status 405: methods not allowed", () => {
        const invalidMethods = ["get", "post", "delete", "put", "patch"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
    describe("/:username", () => {
      describe("GET method", () => {
        it("status 200: for a successful get request by id", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user.username).to.equal("icellusedkars");
              expect(user.name).to.equal("sam");
              expect(user.avatar_url).to.equal(
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
              );
            });
        });
        it("status 404: for a request by username that is a number not a string", () => {
          return request(app)
            .get("/api/users/potter97")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("username doesn't exist");
            });
        });
      });
      describe("invalid methods", () => {
        it("status 405: methods not allowed", () => {
          const invalidMethods = ["post", "delete", "put", "patch"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/icellusedkars")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET method", () => {
        it("status 200: for a successful get request by article id", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.article_id).to.equal(2);
              expect(article.title).to.equal("Sony Vaio; or, The Laptop");
              expect(article.topic).to.equal("mitch");
              expect(article.author).to.equal("icellusedkars");
              expect(article.body).to.equal(
                "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
              );
              expect(article.votes).to.equal(0);
              // expect(article.created_at instanceof Date).to.equal(true);
            });
        });
        it("status 200: response object will have a key of comment count with the correct count", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).to.equal("0");
            });
        });
        it("status 404: valid article_id request, BUT it doesn't exist", () => {
          return request(app)
            .get("/api/articles/999999")
            .expect(404)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("article_id doesn't exist");
            });
        });
        it("status 400: incorrect format for article_id", () => {
          return request(app)
            .get("/api/articles/invalid")
            .expect(400)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
      });
      describe("PATCH method", () => {
        it("status 200: will send this status code for a successful patch to increase vote", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 25 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equals(25);
            });
        });
        it("status 200: will send this status code for a successful patch to decrease vote", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equals(-1);
            });
        });
        it("status 404: valid article_id request, BUT it doesn't exist", () => {
          return request(app)
            .patch("/api/articles/999999")
            .expect(404)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("article for update, doesn't exist");
            });
        });
        it.only("status 400: the amount to increment by isn't a valid data type", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: "abc" })
            .expect(200)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
      });
    });
  });
});
