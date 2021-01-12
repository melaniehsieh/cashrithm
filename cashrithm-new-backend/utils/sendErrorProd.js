const sendErrorProd = (err, res) => {
  if(err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  console.log("💥", err);
  return res.status(500).json({
    status: "error",
    message: `Hmm 😔, Something went very wrong. Try again`
  });
};

module.exports = sendErrorProd;