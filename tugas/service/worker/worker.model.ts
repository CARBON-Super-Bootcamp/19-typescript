import { EntitySchema } from 'typeorm';

export interface WorkerEntity {
  id:number;
  name:string;
  age:number;
  bio:string;
  address:string;
  photo:string;
}


export class Worker{
  id: number;
  name:string;
  age:number;
  bio:string;
  address:string;
  photo:string;
  constructor(id:number, name:string, age:number, bio:string, address:string, photo:string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.bio = bio;
    this.address = address;
    this.photo = photo;
  }
}


export const WorkerSchema = new EntitySchema<WorkerEntity>({
  name: 'Worker',
  target: Worker,
  tableName: 'workers',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    age: {
      type: 'int',
    },
    bio: {
      type: 'text',
    },
    address: {
      type: 'text',
    },
    photo: {
      type: 'varchar',
      length: 255,
    },
  },
});
