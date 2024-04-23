import { Db, MongoClient } from 'mongodb';

export type User = {
    name: string;
    saldo: number;
    picture: string;
  };

export const getUserCollection = async () => {
  const client: MongoClient = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db: Db = client.db('brus');
  const user_collection = db.collection<User>('users');

  return user_collection;
};
