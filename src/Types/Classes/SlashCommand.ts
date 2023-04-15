import { ApplicationCommandOption, SlashCommandBuilder } from "discord.js";
import { SlashCommandConstructorArguments } from "../Interfaces/CommandConstructorArguments.js";
import CommandType from "../Interfaces/CommandType.js";
import Command from "./Command.js";

export default class SlashCommand extends Command {
  private _options: ApplicationCommandOption[];
  private _dmPermission: boolean;

  constructor(data: SlashCommandConstructorArguments) {
    data._type = CommandType.SLASH;
    super(data);
    this._options = data.options ?? [];
    this._dmPermission = data.dmPermission ?? false;
  }

  // Make properties read-only accessible outside of class
  get options() {
    return this._options;
  }
  get dmPermission() {
    return this._dmPermission;
  }

  //Make properties modifiable via functions
  setOptions(options: ApplicationCommandOption[]) {
    this._options = options;
  }
  setDmPermission(dmPermission: boolean) {
    this._dmPermission = dmPermission;
  }
}
