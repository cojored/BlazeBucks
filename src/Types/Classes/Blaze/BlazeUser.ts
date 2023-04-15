import { User } from "discord.js";
import Balance from "./Balance.js";
import { config } from "../../../index.js";
import Material from "./Material.js";
import Pickaxe from "./Pickaxe.js";

export default class BlazeUser {
  _user: User;
  id: string;
  username: string;
  tag: string;
  bot: boolean;

  // Blaze properties
  balance: Balance;
  material: Material;
  pickaxe: Pickaxe;

  constructor(user: User) {
    this._user = user;

    // Set the useful properties
    this.id = user.id;
    this.username = user.username;
    this.tag = user.tag;
    this.bot = user.bot;

    // Set the blaze properties
    this.balance = new Balance(this.id);
    this.material = new Material(this.id);
    this.pickaxe = new Pickaxe(this.id);
  }

  get admin() {
    return config.admin.includes(this.id);
  }

  // The send function
  send(message: string) {
    this._user.send(message);
  }
}
