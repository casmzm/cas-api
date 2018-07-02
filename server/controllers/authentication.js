const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user){
  return jwt.encode({
    first: user.first,
    sub: user.id,
    iat: Date.now(),
    role: user.role
  }, config.secret)
};

exports.signin = function(req, res, next){
  res.send({token: tokenForUser(req.user)});
};

exports.signup =  function(req, res, next){
  
  const email = req.body.email;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;
  const role = "player";

  if (!email || !password || !first || !last){
    return res.status(422).send({error: 'please fill all forms'});
  }

  User.findOne({email: email}, function(err, existingUser){
    // check if user exists
    if(existingUser){
      return res.status(422).send({ error: 'email is in use'})
    }

    // if no user exists, create a new user object
    // and set properties based on req.body data
    const user = new User({
      email: email,
      password: password,
      first: first,
      last: last,
      role: role
    });

    user.save(function(err){
      if(err) {return next(err);}

      res.json({token: tokenForUser(user)});
    });


  });
}