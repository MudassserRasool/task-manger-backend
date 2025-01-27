import { detailedLog } from '../utils/helper.js';

const paginationMiddleware = (req, res, next) => {
  detailedLog('Inside middleware', req.query);
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  req.pagination = { page, limit, skip };
  next();
};

export default paginationMiddleware;
