const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide your password confirm"],
    validate: {
      validator: function(val) {
        return this.password === val;
      },
      message: "Please your password doesn't match"
    }
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date
});


userSchema.pre('save', async function(next) {
  if(!this.isModified("password")) return next();
  
    this.password =  await bcrypt.hash(this.password, 12); 
    this.passwordConfirm = undefined;
    
    next();
});

userSchema.methods.correctPassword = async function(inputPassword, storedPassword) {
  return await bcrypt.compare(inputPassword, storedPassword);
};


userSchema.methods.passwordChangedAfterJWT = function(iat) {
  if(this.passwordChangedAt) {
    const userTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    
    console.log(userTimeStamp, iat);
    return iat < userTimeStamp;
  }
  
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;