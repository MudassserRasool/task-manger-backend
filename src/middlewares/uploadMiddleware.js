const uploadMiddleware = (req, res, next) => {
  if (
    req.query.access_token &&
    req.query.access_token == process.env.ACCESS_TOKEN
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Permission denied',
    });
  }
};

export default uploadMiddleware;
