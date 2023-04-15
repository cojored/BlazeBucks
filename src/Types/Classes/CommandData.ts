import {
  CommandInteraction,
  Message,
  ApplicationCommandOptionType,
  EmbedBuilder,
  APIEmbed,
} from "discord.js";
import BlazeUser from "./Blaze/BlazeUser.js";
import { config } from "../../index.js";

const variables: { [key: string]: string } = config.chat_vars;

function brandEmbed(embed: EmbedBuilder) {
  if (!embed.data.color) embed.setColor(0xff6000);
  if (!embed.data.footer?.text)
    embed.setFooter({
      text: "Blaze Bucks",
      iconURL:
        "https://cdn.discordapp.com/attachments/1034977213302444073/1094402384970649611/Blaze_Bucks_1.png",
    });
  else
    embed.setFooter({
      text: embed.data.footer.text,
      iconURL:
        "https://cdn.discordapp.com/attachments/1034977213302444073/1094402384970649611/Blaze_Bucks_1.png",
    });
  return embed;
}

class CommandData {
  _data: Message | CommandInteraction;
  constructor(data: Message | CommandInteraction) {
    this._data = data;
  }
  reply(message: string | EmbedBuilder) {
    if (typeof message === "string")
      return this._data.reply(this.replace(message));
    else return this._data.reply({ embeds: [brandEmbed(message)] });
  }

  send(message: string | EmbedBuilder) {
    if (typeof message === "string")
      return this._data.channel?.send(this.replace(message));
    else return this._data.channel?.send({ embeds: [brandEmbed(message)] });
  }

  replace(text: string) {
    return text.replace(new RegExp("#{([^{]+)}", "g"), function (_, v: string) {
      return variables[v.toLowerCase()];
    });
  }

  embed(title: string, message: string, reply: boolean = true) {
    const embed = new EmbedBuilder();

    title = this.replace(title);
    message = this.replace(message);

    embed.setTitle(title);
    embed.setDescription(message);
    if (reply) this.reply(embed);
    else this.send(embed);
  }

  error(message: string, reply: boolean = true) {
    const embed = new EmbedBuilder();
    embed.setTitle("Error");

    message = this.replace(message);
    embed.setDescription(message);

    embed.setColor(0xff0000);
    if (reply) this.reply(embed);
    else this.send(embed);
  }
}

export class MessageCommandData extends CommandData {
  author: BlazeUser;
  mentionedUsers: BlazeUser[];

  constructor(data: Message) {
    super(data);

    this.author = new BlazeUser(data.author);
    this.mentionedUsers =
      data.mentions.members?.map((member) => new BlazeUser(member.user)) ?? [];
  }
}

export class InteractionCommandData extends CommandData {
  author: BlazeUser;

  constructor(data: CommandInteraction) {
    super(data);

    this.author = new BlazeUser(data.user);
  }

  getOption(name: string) {
    let option = (this._data as CommandInteraction).options.get(name);
    if (option?.type === ApplicationCommandOptionType.User && option.user)
      return new BlazeUser(option.user);
    else return option;
  }
}
