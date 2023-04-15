import Base from "./Base.js";

class BalanceDocument {
  constructor(public id?: string, public balance?: number) {}
}

export default class Balance extends Base {
  constructor(id: string) {
    super(id, "economy", "balance");
  }

  async get() {
    const balance = (await this.collection.findOne({
      id: this.id,
    })) as BalanceDocument;

    return balance?.balance ?? 0;
  }
  async getString() {
    const balance = (await this.collection.findOne({
      id: this.id,
    })) as BalanceDocument;

    return (balance?.balance ?? 0).toLocaleString() + " #{blaze}";
  }
  async add(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          balance: amount,
        },
      },
      { upsert: true }
    );
  }
  async subtract(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $inc: {
          balance: -amount,
        },
      },
      { upsert: true }
    );
  }
  async set(amount: number) {
    return this.collection.updateOne(
      { id: this.id },
      {
        $set: {
          balance: amount,
        },
      },
      { upsert: true }
    );
  }
}
