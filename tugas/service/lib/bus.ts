import * as nats from 'nats';

let client: nats.Client;

export function connect(url?: string | number, config?: nats.ClientOpts): Promise<unknown> {
  return new Promise<void | Error>((resolve, reject) => {
    client = nats.connect(url, config);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

export function publish(subject: string, data): void {
  client.publish(subject, JSON.stringify(data));
}

export function subscribe(subject: string, callback: Function): number {
  return client.subscribe(subject, callback);
}

export function unsubscribe(sid: number): void {
  return client.unsubscribe(sid);
}

export function close() {
  if (!client) {
    return;
  }
  client.close();
}
