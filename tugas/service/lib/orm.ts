import { Connection, ConnectionOptions, createConnection, EntitySchema }  from 'typeorm';

export function connect(entities:EntitySchema[], config: ConnectionOptions) {
  return createConnection({
    ...config,
    synchronize: true,
    entities,
  });
}
