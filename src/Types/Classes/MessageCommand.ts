import { MessageCommandConstructorArguments } from "../Interfaces/CommandConstructorArguments.js";
import CommandType from "../Interfaces/CommandType.js";
import Command from "./Command.js";

export default class MessageCommand extends Command {
  private _aliases: string[];

  constructor(data: MessageCommandConstructorArguments) {
    data._type = CommandType.MESSAGE;
    super(data);
    this._aliases = data.aliases || [];
  }

  // Make properties read-only accessible outside of class
  get aliases() {
    return this._aliases;
  }

  //Make properties modifiable via functions
  setAliases(aliases: string[]) {
    this._aliases = aliases;
  }
}
