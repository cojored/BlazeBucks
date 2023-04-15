import { config } from "../../../index.js";
import PickaxeType from "../../Interfaces/PickaxeType.js";
import Base from "./Base.js";

class PickaxeDocument {
  constructor(public id?: string, public level?: number) {}
}

export default class Pickaxe extends Base {
  constructor(id: string) {
    super(id, "material", "pickaxe");
  }

  async level() {
    const pickaxe = (await this.collection.findOne({
      id: this.id,
    })) as PickaxeDocument;

    return pickaxe?.level ?? 1;
  }

  async type() {
    let arrayNames = Object.keys(config.pickaxe_types).reverse();
    let lvl = await this.level();
    let index = Object.values(config.pickaxe_types)
      .reverse()
      .findIndex((level) => lvl >= level);

    let pickaxe = arrayNames[index] as PickaxeType;
    if (index === -1) pickaxe = PickaxeType.Wooden_Pickaxe;

    return pickaxe;
  }

  async addLevel(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          level: amount,
        },
      },
      { upsert: true }
    );
  }

  async setLevel(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $set: {
          level: amount,
        },
      },
      { upsert: true }
    );
  }

  async subtractLevel(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          level: -amount,
        },
      },
      { upsert: true }
    );
  }
}
