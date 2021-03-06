//add required packages
const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExp = require("mustache-express");
const path = require("path");
const session = require("express-session");

//initialize express app
const app = express();

//serve static files to server
app.use(express.static(path.join(__dirname,"public")));

//Set up view engine
app.engine("mustache",mustacheExp());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

//Body parser and validator implementation
//Parse json and form data, take all types of
//data via urlencoded extended:true value
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

app.use(session({
  secret:'winnerswin',
  resave: false,
  saveUninitialized: false
}));

// let users = [{username:"adrienne",password:"ab0381"}];

app.get("/",function(req,res){
  if(req.session.username){
    res.render("index",{name:req.session.username, logincount:counter});
  }else{
  res.redirect("/login");
  }
});

app.get("/login",function(req,res){
  res.render("login");
});

let users = [
  {username: "adrbin", password: "ab0381"}
];

app.post("/login",function(req,res){
  let validUser,
      messages = [];

users.forEach(function(user){
  if (user.username === req.body.username) {
    validUser = user;
  }
});

if(validUser === undefined){
  validUser = {};
}

req.checkBody("username", "Please Enter a valid username.").notEmpty().isLength({min: 6, max: 20});
req.checkBody("password", "Please Enter a Password.").notEmpty();
req.checkBody("username", "Invalid password and username combination.").equals(validUser.username);
req.checkBody("password", "Invalid password and username combination.").equals(validUser.password);

let errors = req.validationErrors();
if (errors) {
  errors.forEach(function(error) {
    messages.push(error.msg);
  });

  res.render("login", {errors: messages});
} else {
  req.session.username = req.body.username;
  res.redirect("/");
  }
});
let counter = 1;
app.post('/count',function(req,res){
  counter++;
  res.redirect("/");
});

app.post('/logout',function(req,res){
  counter = 1;
  res.redirect('/');
});

app.get('/signup',function(req,res){
  res.render('signup');
});

app.post('/signup',function(req,res){
  let newUser = {};
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  users.push(newUser);

  res.redirect("/");
});

app.listen(3050,function(req,res){
  console.log("You are running on localhost:3050");
});
