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

BlogPosts.create({
  title: "some title",
  content: "this is where i complain about my life",
  author: "obama",
});

blogRouter.get("/", (req, res) => {
  console.log('heard ya!');
  res.json(BlogPosts.get());
});

blogRouter.post("/", (req, res)=> {
  BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).end();
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
  res.status(204).end();
});

app.listen(process.env.PORT || 8080);