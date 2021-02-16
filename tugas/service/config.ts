import rc from 'rc';
import  { ConnectionOptions } from 'typeorm';

export interface ServiceConfig {
  pg_database: ConnectionOptions;
  minio_database: minioConfig;

  server: {
    taskPort: number
    workerPort: number
    performancePort: number
  };
}

interface minioConfig {
  endPoint: string,
  port: number,
  useSSL: boolean,
  accessKey: string,
  secretKey: string,
}

export const defaultConfig:ServiceConfig = {
  pg_database:  {
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
    taskPort: 7002,
    workerPort: 7001,
    performancePort: 7003,
  },
};

  export const config = rc('tm', defaultConfig);