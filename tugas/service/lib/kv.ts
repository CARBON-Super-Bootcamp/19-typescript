import redis from 'redis';
import { promisify } from 'util';

let client;

export function connect(options?) {
  return new Promise((resolve, reject) => {
    client = redis.createClient(options);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

export function save(db, data) {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(db, data);
}

export async function read(db) {
  const getAsync = promisify(client.get).bind(client);
  const val = await getAsync(db);
  return JSON.parse(val);
}

export function drop(db) {
  const delAsync = promisify(client.del).bind(client);
  return delAsync(db);
}

export function close() {
  if (!client) {
    return;
  }
  if (client.connected) {
    client.end(true);
  }
}