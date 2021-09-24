const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

const startingContent = "Everything about Anything in Tech"
const aboutContent = "About us is this."
const contactContent = "Contact me at"


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blogdb');

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get('/', function (req, res) {
  Post.find({}, function(err, posts){
    res.render('home', {
      starting: startingContent,
      posts: posts
    });
  });
});

app.get('/about', function(req, res) {
  res.render('about', {aboutContent: aboutContent})
})

app.get('/contact', function (req, res) {
  res.render('contact', {contactContent: contactContent});
});

app.get('/compose', function (req, res) {
  res.render('compose')
})

app.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.get('/posts/:postId', function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.listen(3000, function () {
  console.log("server up and running");
});
