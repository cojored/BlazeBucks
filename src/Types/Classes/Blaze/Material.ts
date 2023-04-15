import MaterialType from "../../Interfaces/MaterialType.js";
import Base from "./Base.js";

class MaterialDocument {
  constructor(
    public id?: string,
    public Iron?: number,
    public Gold?: number,
    public Diamond?: number,
    public Emerald?: number
  ) {}
}

export default class Material extends Base {
  constructor(id: string) {
    super(id, "material", "storage");
  }

  async get(type: MaterialType) {
    const data = (await this.collection.findOne({
      id: this.id,
    })) as MaterialDocument;
    return data?.[type] ?? 0;
  }

  async getString(type: MaterialType) {
    const data = (await this.collection.findOne({
      id: this.id,
    })) as MaterialDocument;
    return (data?.[type] ?? 0).toLocaleString() + " #{${type}}";
  }

  async all() {
    const data = (await this.collection.findOne({
      id: this.id,
    })) as MaterialDocument;
    if (data.id) delete data.id;
    return data;
  }

  async allString() {
    const data = (await this.collection.findOne({
      id: this.id,
    })) as MaterialDocument;

    let d: { [key: string]: string } = data as { [key: string]: string };

    return Object.keys(MaterialType)
      .map((key) => `${key}: **${(d?.[key] ?? 0).toLocaleString()}** #{${key}}`)
      .join("\n");
  }

  async add(type: MaterialType, amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          [type]: amount,
        },
      },
      { upsert: true }
    );
  }

  async subtract(type: MaterialType, amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          [type]: -amount,
        },
      },
      { upsert: true }
    );
  }

  async set(type: MaterialType, amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $set: {
          [type]: amount,
        },
      },
      { upsert: true }
    );
  }
}
