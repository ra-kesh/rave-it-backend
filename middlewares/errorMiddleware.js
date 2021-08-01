export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not able to find ${req.originalUrl} `);
  res.status(404);
  next(error);
};

export const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
