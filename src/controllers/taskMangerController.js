import messages from '../constants/messages.js';
import taskManagerService from '../services/taskManagerService.js';
import successResponse from '../utils/successResponse.js';

class TaskManagerController {
  async createTask(req, res, next) {
    try {
      const userId = req.user.id;
      req.body['userId'] = userId;
      const task = await taskManagerService.createTask(req.body);
      successResponse(res, messages.TASK_CREATED, task);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      const tasks = await taskManagerService.getTasks();
      successResponse(res, messages.GET_ALL_TASKS, tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await taskManagerService.getTaskById(req.params.id);
      successResponse(res, messages.GET_SINGLE_TASK, task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskManagerService.updateTask(req.params.id, req.body);
      successResponse(res, messages.TASK_UPDATED, task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const task = await taskManagerService.deleteTask(req.params.id);
      successResponse(res, messages.TASK_DELETED, task);
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskManagerController(taskManagerService);
