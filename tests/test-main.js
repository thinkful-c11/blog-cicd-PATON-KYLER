const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const {app, runServer, closeServer} = require('../server');

describe('blog-posts', function() {
    
    before(function() {
        runServer();
    });
    
    after(function() {
        closeServer();
    });
    
    it('should do something on GET', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            
            const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
            res.body.forEach(function(item) {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
            });
        });
    });
    
    it('should do something on POST', function() {
        const newItem = {
            title: 'my new book',
            content: 'my new content',
            author: 'trump',
        };
        return chai.request(app)
        .post('/blog-posts')
        .send(newItem)
        .then(function(res) {
        //   res.should.have.status(201);
          res.body.should.be.an('array');
          res.body.length.should.be.at.least(1);
          res.body.forEach(function(item) {
              item.id.should.not.be.null;
              item.should.include.keys('title', 'content', 'author', 'id', 'publishDate');
          });
          let newPost = res.body.shift();
          newPost.should.deep.equal(Object.assign(newItem, {id: newPost.id}, {publishDate: newPost.publishDate}));
        });
    });
    
    it('should update on PUT', function() {
        const data = {
            title: 'UPDATED TITLE',
            content: 'UPDATED CONTENT',
            author: 'GO TRUMP',
        };
        return chai.request(app)
        .get('/blog-posts').
        then(function(res){
            data.id = res.body[0].id;
            return chai.request(app)
                .put(`/blog-posts/${data.id}`)
                .send(data);
        })
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);
            res.body[0].should.deep.equal(data);
        })
    });
    
    it('should destroy on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai.request(app)
                   .delete(`/blog-posts/${res.body[0].id}`);
        }).then(function(res) {
            res.should.have.status(204);
        });
    });
})