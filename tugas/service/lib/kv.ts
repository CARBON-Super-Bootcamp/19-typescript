import * as redis from 'redis';
import { promisify } from 'util';

let client: redis.RedisClient;

export function connect(options?: any): Promise<unknown> {
  return new Promise<void | Error>((resolve, reject) => {
    client = redis.createClient(options);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

export function save(db: string, data: number): Promise<void> {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(db, data);
}

export async function read(db: string): Promise<string> {
  const getAsync = promisify(client.get).bind(client);
  const val = await getAsync(db);
  return JSON.parse(val);
}

export function drop(db: string): Promise<string> {
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