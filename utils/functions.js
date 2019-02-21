const DUPKEY = 11000;
/*
handles the duplicate key error, as described here: https://docs.mongodb.com/manual/core/index-unique/
"writeError" : {"code" : 11000, "errmsg" : "E11000 duplicate key error index: test.collection.$a.b_1 dup key: { : null }"}
*/
const Users = require("../models/users");
const Exercises = require("../models/exercises");
const router = require("express").Router();

router.post("/new-user", (req, res, next) => {
  const user = new Users(req.body);
  user.save((err, data) => {
    if (err) {
      if (err.code == DUPKEY) {
        return next({tatus: 400, message: `Username $req.body already exists. Please specify another user!`});
      } else {
        return next(err);
      }
    }
    res.json({username: data.username, _id: data._id});
  })
});

router.post("/add", (req, res, next) => Users.findById(req.body.userId, (err, done) => {
    if (err) {
      return next(err);
    }
    if (!done) {
      return next({status: 400, essage: "_id was not found in the database! Please bear in mind that _id and username are not the same!"})
    }
    let exercise = new Exercises(req.body);
    exercise.username = done.username;
    exercise.save((err, done) => {
      if (err) {
        return next(err);
      }
      done = done.toObject();
      res.json({"_id": done.userId, "description": done.description, "duration": done.duration, "date": (new Date(done.date)).toDateString(), "username": done.username});
    })
  })
);

router.get("/users", (req,res,next) => Users.find({}, (err, data) => res.json(data)));

router.get("/log", (req, res, next) => {
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  Users.findById(req.query.userId, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({status:400, message: "UserId " + req.query.userId + " was not found!"});
    }
    Exercises.find({userId: req.query.userId, date: {$lt: to != 'Invalid Date' ? to.getTime() : Date.now(), $gt: from != 'Invalid Date' ? from.getTime() : 0}}, {__v: 0, _id: 0})
             .sort("-date")
             .limit(parseInt(req.query.limit))
             .exec((err, data) => {
               if(err) {
                 return next(err);
               }
               const out = {
                 "_id": req.query.userId,
                 "username": user.username,
                 "from" : from != 'Invalid Date' ? from.toDateString() : undefined,
                 "to" : to != 'Invalid Date' ? to.toDateString(): undefined,
                 "count": data.length,
                 "log": data.map(d => ({"description": d.description, "duration": d.duration, "date": d.date.toDateString()}))
               }; 
               res.json(out);
             })
  })
})
module.exports = router;
