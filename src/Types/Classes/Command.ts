import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  CommandInteraction,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import CommandConstructorArguments from "../Interfaces/CommandConstructorArguments.js";
import CommandType from "../Interfaces/CommandType.js";
import { InteractionCommandData, MessageCommandData } from "./CommandData.js";
import { config } from "../../index.js";

export default class Command {
  private _name: string;
  private _description: string;
  private _enabled: boolean;
  private _type!: CommandType;
  private _admin: boolean;
  private _beta: boolean;

  private executeCallback?: Function;
  private autoCompleteCallback?: Function;
  private buttonCallback?: Function;
  private modalCallback?: Function;
  private selectMenuCallback?: Function;

  constructor(data: CommandConstructorArguments) {
    this._name = data.name ?? "";
    this._description = data.description ?? "";
    this._enabled = data.enabled ?? true;
    this._type = data._type!;
    this._admin = data.admin ?? false;
    this._beta = data.beta ?? false;
  }

  // Make properties only accesible read only outside of the class
  get enabled() {
    return this._enabled;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get type() {
    return this._type;
  }
  get admin() {
    return this._admin;
  }
  get beta() {
    return this._beta;
  }

  // Make properties modifiable outside of the class via functions
  setName(name: string) {
    this._name = name;
  }
  setDescription(description: string) {
    this._description = description;
  }
  setEnabled(enabled: boolean) {
    this._enabled = enabled;
  }

  execute(data: Function | Message | CommandInteraction, args?: string[]) {
    if (typeof data === "function") this.executeCallback = data;
    else if (this.executeCallback) {
      let d;

      if (this.type === CommandType.MESSAGE)
        d = new MessageCommandData(data as Message);
      else d = new InteractionCommandData(data as CommandInteraction);

      if (!config.beta.includes(d.author.id) && this.beta)
        return d.error("This command is currently in exclusive beta");

      if (this.admin && !d.author.admin) return d.error("You are not an admin");

      if (args) this.executeCallback(d, args);
      else this.executeCallback(d);
    }
  }
  autocomplete(data: Function | AutocompleteInteraction, name?: string) {
    if (typeof data === "function") this.autoCompleteCallback = data;
    else if (this.autoCompleteCallback) this.autoCompleteCallback(data, name);
  }
  button(data: Function | ButtonInteraction, name?: string) {
    if (typeof data === "function") this.buttonCallback = data;
    else if (this.buttonCallback) this.buttonCallback(data, name);
  }
  modal(data: Function | ModalSubmitInteraction, name?: string) {
    if (typeof data === "function") this.modalCallback = data;
    else if (this.modalCallback) this.modalCallback(data, name);
  }
  selectMenu(data: Function | AnySelectMenuInteraction, name?: string) {
    if (typeof data === "function") this.selectMenuCallback = data;
    else if (this.selectMenuCallback) this.selectMenuCallback(data, name);
  }
}
