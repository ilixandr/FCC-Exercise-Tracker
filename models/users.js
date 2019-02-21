'use strict'
const shortid = require("shortid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
let Users = new Schema({username: {type: String, required: true, unique: true, maxlength: [20, "Username cannot be more than 20 characters!"]}, _id: {type: String, index: true, "default": shortid.generate}});
module.exports = Model("Users", Users);
