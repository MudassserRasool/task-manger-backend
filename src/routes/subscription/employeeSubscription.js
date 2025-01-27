import Router from 'express';
import subscriptionController from '../../controllers/subscriptionController.js';
const router = Router();

router.post('/', subscriptionController.purchaseSubscription);
router.get('/', subscriptionController.getUserSubscriptions);
router.get('/active', subscriptionController.getUserActiveSubscription);

export default router;
