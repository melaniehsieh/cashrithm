const ThrowError = require("../utils/ThrowError");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../model/userModel");


exports.getAllUser = wrapAsync(async(req,  res, next) => {
  const user = await User.find();
  
  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user
    }
  });
});

exports.getUser = wrapAsync(async(req,  res, next) => {
  const {id} = req.params;
  
  const user = await User.findById(id);
  
  if(!user) {
    return next(new ThrowError(404, "No user found with that id"));
  }
  
  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.deleteUser = wrapAsync(async(req,  res, next) => {
  const {id} = req.params;
  
  const user = await User.findByIdAndDelete(id);
  
  if(!user) {
    return next(new ThrowError(404, "No user found with that id"));
  }
  
  res.status(204).json({
    status: "success"
  });
});

exports.deleteAllUser = wrapAsync(async(req,  res, next) => {
  const user = await User.deleteMany();
  
  res.status(204).json({
    status: "success"
  });
});