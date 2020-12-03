const sendErrorProd = require("../utils/sendErrorProd");
const sendErrorDev = require("../utils/sendErrorDev");

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
    sendErrorProd(err, res);
  }
};

module.exports = expressErrorHandlingMiddleware;