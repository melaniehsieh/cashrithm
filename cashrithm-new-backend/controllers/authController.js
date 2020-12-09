const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Entities = require("../model/entitiesModel");
const wrapAsync = require("../utils/wrapAsync");
const ThrowError = require("../utils/ThrowError");


// Sign token(jwt)
const signToken = (id) => jwt.sign({ id },  process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })

// signup
exports.signup = wrapAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } = req.body;
  
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  });
  
  const entities = await Entities.create({
    name,
    email,
    user: user._id
  });
  
  const token = signToken(user._id);
  
  const cookiesOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true
  };
  
  if(process.env.NODE_ENV === "production") cookiesOption.secure = true;
  
  res.cookie("token", token, cookiesOption);
  
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  user.password = undefined;
  res.status(201).json({
    status: "success",
    token,
    exp: decodedToken.exp,
    user,
    entities
  });
});

exports.login = wrapAsync(async (req, res, next) => {
  const {email, password} = req.body;
  
  // Check if the email and password exist
  if(!email || !password) {
    return next(new ThrowError(400, "Please provide your email and password"));
  }
  
  // Check if user exist and password match
  const user = await User.findOne({email}).select("+password");
  
  if(!user || !await user.correctPassword(password, user.password)) {
    return next(new ThrowError(401, "Invalid email or password"));
  }
  
  // If everything is OK Generate a token
  const token = signToken(user._id);
  const cookiesOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true
  };
  
  if(process.env.NODE_ENV === "production") cookiesOption.secure = true;
  
  res.cookie("token", token, cookiesOption);
  
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  user.password = undefined;
  
  res.status(200).json({
    status: "success",
    exp: decodedToken.exp,
    token,
    user
  });
});

exports.protect = wrapAsync(async (req, res, next) => {
  // Check for token in authorization header and starts with bearer
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  };
  
  if(!token) {
    return next(new ThrowError(401, "Invalid token, Please log in again!!!"));
  }
  
  // verify the token
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  
  if(!decodedToken) {
    return next(new ThrowError(401, "Invalid token Try again"));
  }
  //console.log(decodedToken);
  
  // check if the exist
  const user = await User.findOne({_id: decodedToken.id});
  
  if(!user) {
    return next(new ThrowError(401, "The token belonging to user does not exist"));
  }
  
  // check if user has not changed password before token was issued
  if(user.passwordChangedAfterJWT(decodedToken.iat)) {
    return next(new ThrowError(401, "User recently changed password, login again!!!"));
  }
  
  // GRANTED ACCESS.
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)) {
    return next(new ThrowError(400, "You are not granted permission to this route"));
  }
  next();
};