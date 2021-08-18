import { Collection, DocClient, Document, JSONObject } from '../src/index.js';

// const docClient = new DocClient('private/data');
// const collection = docClient.db('database').collection('col');

// class Person implements Document {
//   constructor(name: string, age: number, sex: 'male' | 'female', last?: string, student = false) {
//     this.name = name;
//     this.age = age;
//     this.sex = sex;
//     if (last) this.last = last;

//     this.student = undefined;
//   }

//   [key: string]: any;

//   public name: string;
//   public age: number;
//   public sex: 'male' | 'female';
//   public last?: string;
//   public student: undefined;
// }

// collection.insertMany([
//   new Person('Joe', 23, 'male'),
//   new Person('Sophie', 20, 'female', undefined, true),
//   new Person('Maria', 50, 'female'),
//   new Person('Robert', 21, 'male', undefined, true),
// ]);

console.log(Collection.createProjection({ name: 'joe', age: 21 }, { name: 1, age: 0 }));
