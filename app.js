//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Hello! Welcome to my first Blog Website";
const aboutContent = "This is a website where anyone can post your blogs.";
const contactContent = "Ayush Dharmani";

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true});
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.post("/compose", function(req, res){
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
  const post = new Post ({

    title: req.body.postTitle,
 
    content: req.body.postBody
 
  });
 
 post.save();
  // posts.push(post);

  res.redirect("/");

});
app.get("/posts/:postId", function(req, res){
  const reqPostId = req.params.postId;
  const requestedTitle = _.lowerCase(req.params.postId);
  Post.findOne({_id: reqPostId}, function(err, post){res.render("post", {
    title: post.title,
    content: post.content
  });
  });
  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});