import { Collection } from "mongodb";
import { db } from "../../../index.js";

class ShopItem {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public price?: number
  ) {}
}

export default class Shop {
  collection: Collection;

  constructor() {
    this.collection = db.db("economy").collection("shop");
  }

  async getAll() {
    return await this.collection.find().toArray();
  }

  async get(id: number) {
    return (await this.collection.findOne({ id: id })) as ShopItem;
  }

  async create(id: number, name: string, description: string, price: number) {
    return this.collection.insertOne({
      id: id,
      name: name,
      description: description,
      price: price,
    });
  }

  async delete(id: number) {
    return this.collection.findOneAndDelete({ id: id });
  }

  async update(id: number, change: { [key: string]: number | string }) {
    if (
      Object.keys(change).length === 0 ||
      !Object.keys(change).every(
        (key) => key === "name" || key === "description" || key === "price"
      )
    )
      return;

    return this.collection.findOneAndUpdate({ id: id }, { $set: change });
  }
}
