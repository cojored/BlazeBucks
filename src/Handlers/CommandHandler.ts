import Command from "../Types/Classes/Command.js";
import fs from "fs";
import CommandType from "../Types/Interfaces/CommandType.js";
import SlashCommand from "../Types/Classes/SlashCommand.js";
import MessageCommand from "../Types/Classes/MessageCommand.js";
import { CommandInteraction, Interaction, Message } from "discord.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CommandHandler {
  private cmds: Command[];
  private aliases: { [key: string]: string };
  private prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix ?? "?";
    this.cmds = [];
    this.aliases = {};

    let commandFolder = "../Commands/";
    fs.readdirSync(__dirname + "/" + commandFolder).forEach(async (f) => {
      fs.readdirSync(__dirname + "/" + commandFolder + f).forEach(
        async (file) => {
          fs.readdirSync(
            __dirname + "/" + commandFolder + f + "/" + file
          ).forEach(async (i) => {
            if (i.replace(".js", "") === file) {
              let command: Command = (
                await import(
                  `file://${__dirname}/${commandFolder}${f}/${file}/${i}`
                )
              ).default;
              if (this.commands[i.replace(".js", "")])
                throw new Error("Command Already Exists");
              this.cmds.push(command);
              if (command.type === CommandType.MESSAGE) {
                for (let alias in (command as MessageCommand).aliases) {
                  this.aliases[(command as MessageCommand).aliases[alias]] =
                    command.name;
                }
              }
            }
          });
        }
      );
    });
  }

  get commands() {
    let cmds: { [key: string]: Command } = {};
    this.cmds.forEach((i) => (cmds[i.name] = i));

    return cmds;
  }
  get slashCommands() {
    return this.cmds
      .filter((i) => i.type == CommandType.SLASH)
      .map((i) => {
        let cmd = i as SlashCommand;
        let data: any = {};
        data.name = cmd.name;
        data.description = cmd.description;
        data.options = cmd.options;
        data.dmPermission = cmd.dmPermission;
        if (cmd.admin) data.default_member_permissions = "0";
        if (cmd.enabled) return data;
      })
      .filter((i) => i != undefined);
  }

  proccessAndRunMessage(message: Message) {
    if (!message.content.startsWith(this.prefix)) return;
    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift() as string;
    this.executeCommand(command, message);
  }

  executeCommand(name: string, data: CommandInteraction | Message) {
    if (this.aliases[name]) this.commands[this.aliases[name]].execute(data);
    else if (this.commands[name]) this.commands[name].execute(data);
  }
  handleInteraction(name: string, interaction: Interaction) {
    if (interaction.isButton()) {
      this.commands[name].button(
        interaction,
        interaction.customId.split("|")[1]
      );
    }
    if (interaction.isAnySelectMenu()) {
      this.commands[name].selectMenu(
        interaction,
        interaction.customId.split("|")[1]
      );
    }
    if (interaction.isModalSubmit()) {
      this.commands[name].modal(
        interaction,
        interaction.customId.split("|")[1]
      );
    }
    if (interaction.isAutocomplete()) {
      this.commands[name].autocomplete(interaction, interaction.commandName);
    }
  }
}
