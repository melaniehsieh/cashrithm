const sendErrorProd = (err, res) => {
  if(err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  console.log("💥", err);
  return res.status(500).json({
    status: "fail",
    message: "Hmm 😔, Something went wrong. Please try again"
  })
}

module.exports = sendErrorProd;