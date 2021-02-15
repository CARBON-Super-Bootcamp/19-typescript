import * as rc from 'rc';
import { ConnectionOptions } from 'typeorm';

export interface ServiceConfig {
  pg_database: ConnectionOptions;
  minio_database: any;
  server: {
    performancePort: number;
    taskPort: number;
    workerPort: number;
  };
}

const defaultConfig: ServiceConfig = {
  pg_database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'database',
  },
  minio_database: {
    endPoint: '192.168.0.8',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  },
  server: {
    performancePort: 7003,
    taskPort: 7002,
    workerPort: 7001,
  },
};

export const config: ServiceConfig = rc('tm', defaultConfig);
