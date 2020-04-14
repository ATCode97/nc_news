# NC News Backend Express Server

A RESTful server built using knex, express. Gives access to a database containing articles, comments, topics and users.

Hosted on heroku at https://northcodersnews2020.herokuapp.com/

## Setup

In order to use this repo you first need to clone this repo off github and cd in your desired

```
first, cd in to the directory you want this repo in and git clone <your forked repo's-url>
second, cd in to the file
once you in the repo you need to run npm install to get all the dependencies
```

## Available Endpoints for GET All

### Topics -/api/topics

responds with an array of objects that contains topics on a key of topics

https://northcodersnews2020.herokuapp.com/api/topics

### Articles -/api/articles

Responds with an array of objects that contains all articles on a key of articles

https://northcodersnews2020.herokuapp.com/api/articles

This endpoint can take in the following queries:

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query

### Users -/api/users

Responds with an array of objects that contains users on a key of [users](https://northcodersnews2020.herokuapp.com/api/users)

## Available Endpoints - Users

---

### GET users by username -/api/users/:username

Responds with an array of objects that contain a single user on a key of user

https://northcodersnews2020.herokuapp.com/api/users/jessjelly

## Available Endpoints - Articles

---

### GET article by article_id -/api/articles/:article_id

Responds with an array of objects that contains all articles on a key of article, this end points also takes in patch request.

https://northcodersnews2020.herokuapp.com/api/articles/1

### PATCH article by article_id

Responds with a updated single article object, on a key of article.

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g. request body: { "inc_votes": 10 } OR { "inc_votes": -10 }

https://northcodersnews2020.herokuapp.com/api/articles/1

## Available Endpoints - Comments

---

### GET comments by article_id -/api/articles/:article_id/comments

Responds with an array of objects that contains all comments of articles on a key of comments

https://northcodersnews2020.herokuapp.com/api/articles/1/comments

#### Accepts queries

- `sort_by`, which sorts the comments by any valid column (defaults to created_at)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

### POST comments by article_id /api/articles/:article_id/comments

Responds with the post comment object, on a key of comment.

the request body should be - an object with the following properties:

- `username`
- `body`

e.g request body: {"username": "buzz97", "body": "insert comment"}

https://northcodersnews2020.herokuapp.com/api/articles/1/comments

### DELETE /api/comments/:comment_id

Respond with nothing

https://northcodersnews2020.herokuapp.com/api/comments/2

### PATCH

Responds with a updated single comment object, on a key of comment.

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g. request body: { "inc_votes": 10 } OR { "inc_votes": -10 }

  https://northcodersnews2020.herokuapp.com/api/comments/2

---

# TESTING

In oder to test that each endpoint works, mocha and chai is need to run the app.spec.js test file

```
npm install
npm test
```
