const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational trusted error send to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programing or other unknow error:don't leak error details
  } else {
    console.log("Error: ", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "production") {
    sendErrorProd(res, err);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
