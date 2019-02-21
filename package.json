const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true); /* Get rid of the "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead." warning.*/

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + '/views/index.html'));

const worker = require("./utils/functions.js");
app.use("/api/exercise", worker);

// Not found middleware
app.use((req, res, next) => next({status: 404, message: 'not found'}));

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;
  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors); // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res.status(errCode).type("txt").send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
