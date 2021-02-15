import nats from 'nats';

let client;

export function connect(url?, config?) {
  return new Promise((resolve, reject) => {
    client = nats.connect(url, config);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

export function publish(subject, data) {
  client.publish(subject, JSON.stringify(data));
}

export function subscribe(subject, callback) {
  return client.subscribe(subject, callback);
}

export function unsubscribe(sid) {
  return client.unsubscribe(sid);
}

export function close() {
  if (!client) {
    return;
  }
  client.close();
}
