import { requireAuth } from '../middlewares/authMiddleware.js';
import taskMangerRoute from '../routes/taskMangerRoute.js';
import userRouter from '../routes/userRoute.js';
const apiRoutes = [
  {
    baseResource: 'user',
    router: userRouter,
    middlewares: [],
  },

  {
    baseResource: 'task',
    router: taskMangerRoute,
    middlewares: [requireAuth],
  },
];

export default apiRoutes;
