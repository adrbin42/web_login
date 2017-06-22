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
    res.render("index");
  }else{
  res.render("login");
  }
});

app.get("/login",function(req,res){
  res.render("login");
});

let users = [{username: "", password: ""}];
console.log(users);

app.post("/login",function(req,res){
  let validUser;
  messages = [];
  let i=1;


  users.username[i] += req.body.username;
  users.password[i] += req.body.password;


console.log(users);
users.forEach(function(user){
  if (users.username === req.body.username) {
    validUser = user;
  }
});

req.checkBody("username", "Please Enter a valid username.").notEmpty().isLength({min: 6, max: 20});
req.checkBody("password", "Please Enter a Password.").notEmpty();
req.checkBody("username", "Invalid password and username combination.").equals(users.username);
req.checkBody("password", "Invalid password and username combination.").equals(users.password);
                                                                // [ { username: '', password: '' } ]
let errors = req.validationErrors();

if (errors) {
  errors.forEach(function(error) {
    messages.push(error.msg);
  });
  res.render("login", {errors: messages});
} else {

  req.session.username = req.body.username;

  res.redirect("/index");
}

res.redirect("/index");
});

app.listen(3050,function(req,res){
  console.log("You are running on localhost:3050");
});
