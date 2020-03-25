process.env.NODE_ENV = "test";
const connection = require("../connection");
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
chai.use(require("sams-chai-sorted"));

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
    describe("GET method", () => {
      it("status 200: successfully get all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(12);
            expect(articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("status 200: will have a key of comment count with the correct count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).to.contain.keys("comment_count");
            expect(articles[0].comment_count).to.equal("13");
          });
      });
      it("status 200: can sort queries by created_at in descending order by default", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("created_at");
          });
      });
      it("status 200: can sort queries by in an ascending order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy("created_at");
          });
      });
      it("status 200: can sort queries by author", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("author");
          });
      });
      it("status 200: can sort queries by title", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("title");
          });
      });
      it("status 200: can sort queries by article_id", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("article_id");
          });
      });
      it("status 200: can sort queries by topic", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("topic");
          });
      });
      it("status 200: can sort queries by votes", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("votes");
          });
      });
      it("status 200: can sort queries by comment_count", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy("comment_count");
          });
      });
      it("status 200: can filter query by specific author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(3);
            articles.forEach(article => {
              expect(article.author).to.equal("butter_bridge");
            });
          });
      });
      it("status 200: can filter query by specific topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(11);
            articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("status 400: return an error message if met with an invalid sort_by request", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("bad request");
          });
      });
      xit("status 400: return an error message if met with an invalid order request", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("bad request");
          });
      });
      xit("status 400: author or topic that doesn't exist", () => {}); // one that doesn't clash with author that hasnt written?
    });
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
              expect(article).to.contain.keys("created_at");
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
        it("status 200: will successfully patch despite the body have more than one key", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 6, name: "mitch" })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equals(6);
            });
        });
        it("status 200: the request body is empty the response wouldn't change", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({})
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equals(1);
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
        it("status 400: the amount to increment by isn't a valid data type", () => {
          return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: "abc" })
            .expect(400)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
      });
      describe("invalid methods", () => {
        it("status 405: methods not allowed", () => {
          const invalidMethods = ["post", "delete"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/2")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });

      describe("/comments", () => {
        describe("POST method", () => {
          it("status 201: will post successfully", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .send({
                username: "icellusedkars",
                body: "buzz light year to the rescue"
              })
              .expect(201)
              .expect(({ body: { comment } }) => {
                expect(comment.comment_id).to.equal(19);
                expect(comment.author).to.equal("icellusedkars");
                expect(comment.article_id).to.equal(2);
                expect(comment.votes).to.equal(0);
                expect(comment.body).to.equal("buzz light year to the rescue");
                expect(comment).to.contain.keys("created_at");
              });
          });
          it("status 201: will successfully post despite the body have an extra key", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .expect(201)
              .send({
                username: "icellusedkars",
                body: "buzz light year to the rescue",
                void: "void"
              })
              .expect(({ body: { comment } }) => {
                expect(comment.comment_id).to.equal(19);
                expect(comment.author).to.equal("icellusedkars");
                expect(comment.article_id).to.equal(2);
                expect(comment.votes).to.equal(0);
                expect(comment.body).to.equal("buzz light year to the rescue");
                expect(comment).to.contain.keys("created_at");
              });
          });
          it("status 400: the article id in path isn't a valid data type", () => {
            return request(app)
              .post("/api/articles/invalid/comments")
              .send({
                username: 999,
                body: "buzz light year to the rescue"
              })
              .expect(400)
              .expect(({ body: { msg } }) => {
                expect(msg).to.equal("bad request");
              });
          });
          it("status 422: posting with an invalid datatype", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .expect(422)
              .send({
                username: 999,
                body: "buzz light year to the rescue"
              })
              .expect(({ body: { msg } }) => {
                expect(msg).to.equal("unprocessable entity");
              });
          });
          it("status 422: valid article_id request, BUT it doesn't exist", () => {
            return request(app)
              .post("/api/articles/50/comments")
              .send({
                username: "icellusedkars",
                body: "buzz light year to the rescue"
              })
              .expect(422)
              .expect(({ body: { msg } }) => {
                expect(msg).to.equal("unprocessable entity");
              });
          });
        });
        describe("GET method", () => {
          it("status 200: will successfully get comment by article id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(13);
                expect(comments[0]).to.contain.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
          });
          it("status 200: can sort queries by created_at in descending order by default", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=created_at")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("created_at");
              });
          });
          it("status 200: can sort queries by comment_id", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=comment_id")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("comment_id");
              });
          });
          it("status 200: can sort queries by votes", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("votes");
              });
          });
          it("status 200: can sort queries by author", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("author");
              });
          });
          it("status 200: can sort queries by body", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=body")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy("body");
              });
          });
          it("status 200: can set sort order to ascending", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.ascendingBy("created_at");
              });
          });
          it("status 400: return an error message if met with an invalid sort_by request", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=invalid")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("bad request");
              });
          });
          it("status 404: valid article_id request, BUT it doesn't exist ", () => {
            return request(app)
              .get("/api/articles/50/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("article_id doesn't exist");
              });
          });
        });
      });
    });
  });
  describe.only("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH method", () => {
        it("status 200: will send this status code for a successful patch to increase vote", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equals(24);
            });
        });
        it("status 200: will send this status code for a successful patch to decrease vote", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equals(4);
            });
        });
        it("status 200: will successfully patch despite the body have more than one key", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: 10, name: "mitch" })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equals(24);
            });
        });
        it("status 200: the request body is empty the response wouldn't change", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({})
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equals(15);
            });
        });
        it("status 404: valid comment_id request, BUT it doesn't exist", () => {
          return request(app)
            .patch("/api/comments/999999")
            .expect(404)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("comment_id for update doesn't exist");
            });
        });
        it("status 400: the amount to increment by isn't a valid data type", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "abc" })
            .expect(400)
            .expect(({ body: { msg } }) => {
              expect(msg).to.equal("bad request");
            });
        });
      });
    });
  });
});
