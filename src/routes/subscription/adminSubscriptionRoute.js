import { Router } from 'express';
import subscriptionController from '../../controllers/subscriptionController.js';

const router = Router();

router.post('/', subscriptionController.createSubscription);
router.get('/', subscriptionController.getSubscriptions);
router.get('/:id', subscriptionController.getSubscription);
router.patch('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

export default router;
