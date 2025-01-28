import { prisma } from '../config/db.js';

class TaskManagerService {
  async createTask(data) {
    const task = await prisma.task.create({
      data,
    });
    return task;
  }

  async getTasks() {
    const tasks = await prisma.task.findMany();
    return tasks;
  }

  async getTaskById(id) {
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });
    return task;
  }

  async updateTask(id, data) {
    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data,
    });
    return task;
  }

  async deleteTask(id) {
    const task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });
    return task;
  }
}

export default new TaskManagerService();
