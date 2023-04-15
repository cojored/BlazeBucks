import { Collection } from "mongodb";
import { db } from "../../../index.js";

export default class Base {
  protected id: string;
  protected collection: Collection<Document>;

  constructor(id: string, database: string, collection: string) {
    this.id = id;
    this.collection = db.db(database).collection(collection);
  }
}
