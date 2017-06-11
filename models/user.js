const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save Hook, encrypt password
// Before save model run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;
  // generate the salt then run the callback
  // https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err); 
    }
    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      // overwrite the password with the hash password
      user.password = hash;
      // continue the execution to save
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
}

// Create the model Class
const modelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = modelClass;