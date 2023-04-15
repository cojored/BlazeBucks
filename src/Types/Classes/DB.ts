import { MongoClient } from "mongodb";

export default class DB {
  client: MongoClient;

  constructor(uri: string) {
    let client = new MongoClient(uri);
    client.connect();

    this.client = client;
  }
}
