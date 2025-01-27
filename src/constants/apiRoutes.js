import authMiddleware from '../middlewares/authMiddleware.js';
import featureRouter from '../routes/featureRoute.js';
import profileRouter from '../routes/profileRoute.js';
import adminSubscriptionRouter from '../routes/subscription/adminSubscriptionRoute.js';
import employeeSubscriptionRouter from '../routes/subscription/employeeSubscription.js';
import userRouter from '../routes/userRoute.js';
const apiRoutes = [
  {
    baseResource: 'user',
    router: userRouter,
    middlewares: [],
  },
  {
    baseResource: 'profile',
    router: profileRouter,
    middlewares: [authMiddleware.authenticateUser],
  },
  {
    baseResource: 'admin/subscription',
    router: adminSubscriptionRouter,
    middlewares: [authMiddleware.authorizeAdmin],
  },
  {
    baseResource: 'employee/subscription',
    router: employeeSubscriptionRouter,
    middlewares: [authMiddleware.authenticateUser],
  },
  {
    baseResource: 'feature',
    router: featureRouter,
    middlewares: [authMiddleware.authorizeAdmin],
  },
];

export default apiRoutes;
