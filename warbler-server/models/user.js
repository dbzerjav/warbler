const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

//create hashed password
userSchema.pre("save", async function(next) {
  try {
    if(!this.isModified('password')){
      return next();
    }
    let hashedPassword = bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch(err) {
      return next(err);
  }
});

//function to compare hashed passwords with user input
userSchema.methods.comparePassword = async function(candidiatePassword, next) {
  try {
    let isMatch = await bcrypt.compare(candidiatePassword, this.password);
    return isMatch;
  } catch(err) {
    return next(err);
  }
}

const User = mongoose.model("User", userSchema);

module.exports = User;
