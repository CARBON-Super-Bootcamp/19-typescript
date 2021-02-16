import { EntitySchema } from 'typeorm';

export interface forWorker {
  id?: number;
  name:string;
  age:number|string;
  bio:string;
  address:string;
  photo:string;
}


//let Worker:forWorker[];
export class Worker{
  id?: number;
  name:string;
  age:number|string;
  bio:string;
  address:string;
  photo:string;
  constructor(id:number, name:string, age:string|number, bio:string, address:string, photo:string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.bio = bio;
    this.address = address;
    this.photo = photo;
  }
}




export const WorkerSchema = new EntitySchema({
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

// module.exports = {
//   Worker,
//   WorkerSchema,
// };
