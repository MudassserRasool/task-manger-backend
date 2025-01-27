import Router from 'express';
import featureController from '../controllers/featuresController.js';
const router = Router();

router.post('/', featureController.createFeature);
router.get('/', featureController.getFeatures);
router.get('/:id', featureController.getFeature);
router.put('/:id', featureController.updateFeature);
router.delete('/:id', featureController.deleteFeature);

export default router;
