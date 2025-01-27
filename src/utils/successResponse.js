const successResponse = (
  res,
  message = 'success',
  data = {},
  statusCode = 200
) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    statusCode,
    data,
  });
};

export default successResponse;
