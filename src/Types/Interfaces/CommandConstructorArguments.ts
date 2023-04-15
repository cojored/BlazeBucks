import { ApplicationCommandOption } from "discord.js";
import CommandType from "./CommandType.js";

export default interface CommandConstructorArguments {
  name?: string;
  description?: string;
  enabled?: boolean;
  admin?: boolean;
  beta?: boolean;
  _type?: CommandType;
}

export interface SlashCommandConstructorArguments
  extends CommandConstructorArguments {
  options?: ApplicationCommandOption[];
  dmPermission?: boolean;
}

export interface MessageCommandConstructorArguments
  extends CommandConstructorArguments {
  aliases: string[];
}
