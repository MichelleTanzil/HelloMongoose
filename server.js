const express = require("express");
const app = express();
const session = require("express-session");
app.use(
  session({
    secret: "keyboardkitteh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/HelloMongoose", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});
// create an object that contains methods for mongoose to interface with MongoDB
const User = mongoose.model("User", UserSchema);
app.use(express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: true }));
app.listen(8000, () => console.log("listening on port 8000"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/users", (req, res) => {
  console.log(req.body);
  const user = new User();
  user.name = req.body.name;
  user.age = req.body.age;
  user
    .save()
    .then(newUserData => console.log("user created: ", newUserData))
    .catch(err => console.log(err));
  res.redirect("/results");
});

app.get("/results", (req, res) => {
  User.find()
    .limit(1)
    .sort({ $natural: -1 })
    .then(data => {
      res.render("results", { users: data });
      console.log(data);
    })
    .catch(err => res.json(err));
});
