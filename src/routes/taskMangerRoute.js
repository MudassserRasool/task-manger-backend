import Router from 'express';
import taskMangerController from '../controllers/taskMangerController.js';

const router = Router();

//  route for task manger

router.post('/', taskMangerController.createTask);
router.get('/', taskMangerController.getTasks);
router.get('/:id', taskMangerController.getTaskById);
router.put('/:id', taskMangerController.updateTask);
router.delete('/:id', taskMangerController.deleteTask);

export default router;
