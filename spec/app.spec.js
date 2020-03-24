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
      it("status 200: response will be a array and will have a status of 200 for a successful get", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an("array");
            expect(topics[0]).to.be.an("object");
          });
      });
      it("status 200: response object is an array with the correct key", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
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
            });
        });
        it("status 404: for a request by username that is a number not a string", () => {
          return request(app)
            .get("/api/users/potter97")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("user doesn't exist");
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
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("GET method", () => {
          it("status 200: for a successful get request by article id", () => {
            return request(app)
              .get("/api/users/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.article_id).to.equal(1);
              });
          });
        });
      });
    });
  });
});
