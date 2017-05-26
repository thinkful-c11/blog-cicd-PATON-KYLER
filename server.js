'use strict';
const express = require('express');

const bodyParser = require('body-parser');

const logger = require('morgan');

const app = express();

const {BlogPosts} = require('./models');

const blogRouter = express.Router();

const jsonParser = bodyParser.json();

app.use(logger('common'));
app.use(jsonParser);
app.use("/blog-posts", blogRouter);

BlogPosts.create(
  "some title",
  "this is where i complain about my life",
  "obama"
);

blogRouter.get("/", (req, res) => {
  res.json(BlogPosts.get());
});

blogRouter.post("/", (req, res)=> {
  BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  // res.status(201).end();
  res.json(BlogPosts.get());
});

blogRouter.delete("/:id", (req, res)=>{
  BlogPosts.delete(req.params.id);
  res.status(204).end();
});

blogRouter.put("/:id", (req, res)=>{
  BlogPosts.update({
    title: req.body.title, 
    content: req.body.content, 
    author: req.body.author, 
    publishDate: req.body.publishDate, 
    id: req.params.id
  });
  res.send(BlogPosts.get());
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

// app.listen(8080);

module.exports = {app, runServer, closeServer};
