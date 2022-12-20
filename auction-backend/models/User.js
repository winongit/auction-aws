const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
  },
  imgUrl: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
