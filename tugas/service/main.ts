import * as orm from './lib/orm';
import * as storage from './lib/storage';
// const kv = require('./lib/kv');
// const bus = require('./lib/bus');
import { TaskSchema } from'./tasks/task.model';
import { WorkerSchema } from'./worker/worker.model';
// const workerServer = require('./worker/server');
import * as tasksServer from './tasks/server';
import * as performanceServer from './performance/server';
// const performanceServer = require('./performance/server');
const {config} = require('./config')
import  { ConnectionOptions } from 'typeorm';

async function init() {
  try {
    console.log('connect to database');
    await orm.connect([WorkerSchema,TaskSchema], config.pg_database);
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed',err);
    process.exit(1);
  }
  try {
    console.log('connect to object storage');
    await storage.connect('task-manager', config.minio_database);
    console.log('object storage connected');
  } catch (err) {
    console.error('object storage connection failed',err);
    process.exit(1);
  }
  // try {
  //   console.log('connect to message bus');
  //   await bus.connect();
  //   console.log('message bus connected');
  // } catch (err) {
  //   console.error('message bus connection failed');
  //   process.exit(1);
  // }
  // try {
  //   console.log('connect to key value store');
  //   await kv.connect();
  //   console.log('key value store connected');
  // } catch (err) {
  //   console.error('key value store connection failed');
  //   process.exit(1);
  // }
}

async function onStop() {
  // bus.close();
  // kv.close();
}

async function main(command) {
  switch (command) {
    case 'performance':
      await init();
      performanceServer.run(onStop);
      break;
    case 'task':
      await init();
      tasksServer.run(onStop);
      break;
    case 'worker':
      // await init();
      // workerServer.run(onStop);
      // break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker, performance');
  }
}

main(process.argv[2]);
