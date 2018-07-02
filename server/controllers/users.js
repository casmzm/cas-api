const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');
const decode = require('jwt-decode')

exports.getuser = function(req, res, next){
  if (!req.get("authorization")) {
    res.json({error: "You must be logged in to see this page"}).status(422)
  }

  var userId = decode(req.get("authorization")).sub
  var query = User.findById(userId)
  var promise = query.select("-password").populate('army.upgrades').populate('army.equipment').exec()

  promise.then(function(data) {
    res.json(data).status(200)
  })
}

exports.addFavorite = function(req, res, next) {
  if (!req.get("authorization")) {
    res.json({error: "You must be logged in to see this page"}).status(422)
  }

  var userId = decode(req.get("authorization")).sub
  var newFavorite = {
    Title: req.body.Title,
    Year: req.body.Year,
    imdbID: req.body.imdbID,
    Poster: req.body.Poster
  }
  
  User.update({_id: userId}, {$push: {favorites: newFavorite}}, function(err, user) {
    if(err) {
      console.log(err)
    } else {
      res.send({success: newFavorite}).status(200)
    }
  })
}

exports.addFighter = function(req, res, next) {
  if (!req.get("authorization")) {
    res.json({error: "You must be logged in to see this page"}).status(422)
  }

  var userId = decode(req.get("authorization")).sub
  var newFighter = req.body
  
  if (!userId) {
    res.json({error: "userId not found. please logout and try again"}).status(422)
  }

  if (!newFighter) {
    res.json({error: "figher information could not be parsed. Please try again"}).status(422)
  }

  User.findById(userId, function(err, user) {
    if(err) {
      res.json(err).status(501)
    }
    user.army.push(newFighter)
    user.save(function(err) {
      if(err) {
        res.json(err).status(501)
      } else {
        res.json({success: "Added!", newFighter}).status(200)
      }
    })
  })
}