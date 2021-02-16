import { getConnection } from 'typeorm';
import * as workerClient from './worker.client';
import {TaskSchema,TaskEntity} from './task.model';

// const bus = require('../lib/bus');

export const ERROR_TASK_DATA_INVALID = 'data pekerjaan baru tidak lengkap';
export const ERROR_TASK_NOT_FOUND = 'pekerjaan tidak ditemukan';
export const ERROR_TASK_ALREADY_DONE = 'pekerjaan sudah selesai';

export interface TaskData {
  job:string;
  attachment:string;
  assigneeId:number;
}


export async function add(data: TaskData): Promise<TaskEntity>{
  if (!data.job || !data.assigneeId) {
    throw ERROR_TASK_DATA_INVALID;
  }
  await workerClient.info(data.assigneeId);
  const taskRepo = getConnection().getRepository<TaskEntity>(TaskSchema);
  const newTask = await taskRepo.save({
    job: data.job,
    assignee: { id: data.assigneeId },
    attachment: data.attachment,
  });
  const task = await taskRepo.findOne(newTask.id, { relations: ['assignee'] });
  if (!task) {
    throw ERROR_TASK_NOT_FOUND;
  }
  // bus.publish('task.added', task);
  return task;
}

export async function done(id) {
  const taskRepo = getConnection().getRepository<TaskEntity>(TaskSchema)
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  if (task.done) {
    throw ERROR_TASK_ALREADY_DONE;
  }
  task.done = true;
  await taskRepo.save(task);
  // bus.publish('task.done', task);
  return task;
}

export async function cancel(id) {
  const taskRepo = getConnection().getRepository<TaskEntity>(TaskSchema);
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  task.cancelled = true;
  await taskRepo.save(task);
  // bus.publish('task.cancelled', task);
  return task;
}

export function list() {
  const taskRepo = getConnection().getRepository<TaskEntity>(TaskSchema);
  return taskRepo.find({ relations: ['assignee'] });
}