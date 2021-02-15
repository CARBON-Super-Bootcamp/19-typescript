import * as orm from './lib/orm';
import * as storage from './lib/storage';
import * as kv from './lib/kv';
import * as bus from './lib/bus';
import { TaskSchema } from './tasks/task.model';
import { WorkerSchema } from './worker/worker.model';
import workerServer from './worker/server';
import tasksServer from './tasks/server';
import * as performanceServer from './performance/server';
import { config } from './config'


async function init() {
  try {
    console.log('connect to database');
    await orm.connect([WorkerSchema, TaskSchema], config.pg_database);
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    process.exit(1);
  }
  try {
    console.log('connect to object storage');
    await storage.connect('task-manager', {
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'local-minio',
      secretKey: 'local-test-secret',
    });
    console.log('object storage connected');
  } catch (err) {
    console.error('object storage connection failed');
    process.exit(1);
  }
  try {
    console.log('connect to message bus');
    await bus.connect();
    console.log('message bus connected');
  } catch (err) {
    console.error('message bus connection failed');
    process.exit(1);
  }
  try {
    console.log('connect to key value store');
    await kv.connect();
    console.log('key value store connected');
  } catch (err) {
    console.error('key value store connection failed');
    process.exit(1);
  }
}

async function onStop() {
  bus.close();
  kv.close();
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
      await init();
      workerServer.run(onStop);
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker, performance');
  }
}

main(process.argv[2]);
