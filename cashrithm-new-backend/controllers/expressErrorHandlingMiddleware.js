const sendErrorProd = require("../utils/sendErrorProd");
const sendErrorDev = require("../utils/sendErrorDev");
const ThrowError = require("../utils/ThrowError");

const handleValidationError = err => {
  const message = Object.keys(err.errors).map(key => {
    return err.errors[key].message;
  });
  
  return new ThrowError(401, message.join(" "));
};

const handleDuplicateEmail = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  
  const message = `Duplicate Email: ${value}. Please use another Email!`;
  return new ThrowError(401, message)
};

const handleJWTError = () => new ThrowError(401, "Invalid token, please login");

const handleJWTExpiredError = () => new ThrowError(401, "Your token has expired, please login");

const expressErrorHandlingMiddleware = (err, req, res, next) => {
  if(process.env.NODE_ENV === "development") {
    //console.log(err);
    // For error which is not operational (not sent by us)
    err.statusCode = err.statusCode || 500;
    err.status = (`${err.statusCode}`.startsWith("4") ? "fail" : "error");
    //err.message = err.message || "something went wrong";
    
    sendErrorDev(err, res);
  }
  if(process.env.NODE_ENV === "production") {
    
    if(err.name === "ValidationError") err = handleValidationError(err);
    
    if(err.code === 11000) err = handleDuplicateEmail(err);
    
    if(err.name === "JsonWebTokenError") err = handleJWTError();
    
    if(err.name === "TokenExpiredError") err = handleJWTExpiredError();
    
    sendErrorProd(err, res);
  }
};

module.exports = expressErrorHandlingMiddleware;