const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, //Not part of validation
  },
});

// Add on fields for pwd and username as well as some functionalities
UserSchema.plugin(passport);

module.exports = mongoose.model('User', UserSchema);
