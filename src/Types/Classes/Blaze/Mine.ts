import OreType from "../../Interfaces/OreType.js";
import PickaxeType from "../../Interfaces/PickaxeType.js";
import BlazeUser from "./BlazeUser.js";

export default class Mine {
  private table: (OreType | PickaxeType)[][];
  private _collected: { [key: string]: number } = {
    Iron: 0,
    Gold: 0,
    Diamond: 0,
    Emerald: 0,
  };

  private player: number[];
  private _width: number;
  private _height: number;
  user: BlazeUser;

  private pickaxe: PickaxeType = PickaxeType.Wooden_Pickaxe;
  private level: number = 1;

  constructor(user: BlazeUser, width: number, height: number) {
    this._width = width;
    this._height = height;
    this.user = user;
    this.table = [];
    this.player = [Math.floor(width / 2), Math.floor(height / 2)];
  }

  get collected() {
    return this._collected;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get playerPosition() {
    return this.player;
  }
  get empty() {
    return this.table.every((row) =>
      row.every(
        (ore) => ore === OreType.Air || Object.keys(PickaxeType).includes(ore)
      )
    );
  }

  async generateTable() {
    let ores = Object.keys(OreType);
    ores.splice(ores.indexOf(OreType.Air), 1);

    this.table = [];

    for (let h = 0; h < this._height; h++) {
      let row: OreType[] = [];

      for (let w = 0; w < this._width; w++)
        row.push(ores[Math.floor(Math.random() * ores.length)] as OreType);

      this.table.push(row);
    }

    this.pickaxe = (await this.user.pickaxe.type()) as PickaxeType;
    this.level = await this.user.pickaxe.level();

    this.table[this.player[0]][this.player[1]] = this.pickaxe;
  }

  mine(x: number, y: number) {
    let current = this.table[x]?.[y];
    if (current === undefined) return;

    let name = current.split("_")[0];

    let playerX = this.player[0];
    let playerY = this.player[1];

    if (this._collected[name] != undefined) this._collected[name]++;

    this.table[playerX][playerY] = OreType.Air;

    this.table[x][y] = this.pickaxe;

    this.player = [x, y];
  }

  render() {
    return this.table
      .map((row) => row.map((ore) => `#{${ore}}`).join(" "))
      .join("\n");
  }

  async calculateMaterials() {
    let materials: { [key: string]: number } = {
      Iron: 0,
      Gold: 0,
      Diamond: 0,
      Emerald: 0,
    };

    Object.keys(this.collected).forEach((x) => {
      materials[x] = this.collected[x] * (7 * this.level);
    });

    return materials;
  }
}
