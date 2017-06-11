const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // convention sub = subproperty, iat = issue at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user have already the user and password
  // we have to give them the token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
  // res.send({ success: 'true' });
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide an email and a password'});
  }

  // See if a user with a given user exist
  User.findOne({ email: email },function(err, existingUser) {
    if (err) {
      return next(err);
    }
    // If a user with a email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
    // If a user with email does not exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { 
        return next(err); 
      }
      // Respond to request indicating the user was created
      // res.json(user);
      res.json({ token: tokenForUser(user) });
    });
  });
  
  
}