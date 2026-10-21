const errorMiddleware = (err, req, res, next) => {
    
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    status: 500,
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;