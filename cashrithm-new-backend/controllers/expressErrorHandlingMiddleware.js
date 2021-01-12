const sendErrorProd = require("../utils/sendErrorProd");
const sendErrorDev = require("../utils/sendErrorDev");
const ThrowError = require("../utils/ThrowError");

// Validation Error
const handleValidationError = (err) => {
  const message = Object.keys(err.errors).map(key => {
    return err.errors[key].message;
  });
  
  return new ThrowError(400, message.join("."));
};

// Duplicate Email
const handleDuplicateEmail = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  
  const message = `This Email: ${value}, already exists. Please use another Email!`;
  return new ThrowError(400, message);
};

// For invalid token
const handleJWTError = () => new ThrowError(401, "Invalid token, please login again");

// For token expired
const handleJWTExpiredError = () => new ThrowError(401, "Your token has expired, please login");


const expressErrorHandlingMiddleware = (err, req, res, next) => {
  if(process.env.NODE_ENV === "development") {
    err.statusCode = err.statusCode || 500;
    err.status = (`${err.statusCode}`.startsWith("4") ? "fail" : "error");
    
    sendErrorDev(err, res);
  }
  
  if(process.env.NODE_ENV === "production") {
   
    if(err.name === "ValidationError") err =  handleValidationError(err);
    
    if(err.code === 11000) err = handleDuplicateEmail(err);
    
    if(err.name === "JsonWebTokenError") err = handleJWTError();
    
    if(err.name === "TokenExpiredError") err = handleJWTExpiredError();
  
    sendErrorProd(err, res);
  }
};

module.exports = expressErrorHandlingMiddleware;