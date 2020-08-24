var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("."));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/gova");
var nameSchema = new mongoose.Schema({
  date: Date,
  type: String,
  name: String,
  amount: Number,
  comments: String
});

var User = mongoose.model("budget", nameSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/income.html");
});

app.post("/new", (req, res) => {
  var myData = new User(req.body);
  myData
    .save()
    .then(item => {
      // res.send('<script>alert("Entry inserted")</script>');
      res.sendFile(__dirname + "/income.html");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

app.get("/data", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("gova");
    dbo
      .collection("budgets")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        db.close();
      });
  });
});
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
