'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const Exercises = new Schema({
  description: {type: String, required: true, maxlength: [20, "Decription cannot exceed 20 characters!"]},
  duration: {type: Number, required: true, min: [1, "Duration cannot be less than 1 minute!"]},
  date: {type: Date, default: Date.now},
  username: String,
  userId: {type: String, ref: "Users", index: true}
});
Exercises.pre("save", (next) => Model("Users").findById(this.userId, (err, done) => {
    if (err) {
      return next(err);
    }
    if (!done) {
      const err = new Error('unknown userId');
      err.status = 400;
      return next(err);
    }
    this.username = done.username;
    if (!this.date) {
      this.date = Date.now();
    }
    next();
  })
);
module.exports = Model("Exercises", Exercises);
