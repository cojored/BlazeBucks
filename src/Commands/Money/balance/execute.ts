import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteractionOption,
} from "discord.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import BlazeUser from "../../../Types/Classes/Blaze/BlazeUser.js";

export default async function execute(data: InteractionCommandData) {
  let group = (
    data._data as ChatInputCommandInteraction
  ).options.getSubcommandGroup();
  let command = (
    data._data as ChatInputCommandInteraction
  ).options.getSubcommand();

  if (group === "admin" && !data.author.admin)
    return data.error("You are not an admin");

  let user = (data.getOption("user") as BlazeUser) ?? data.author;
  let amount = data.getOption("amount") as CommandInteractionOption<CacheType>;

  if (user.bot) return data.error("You can't do that to a bot");

  switch (command) {
    case "set":
      user.balance.set(amount.value as number);
      data.embed(
        `Balance Set`,
        `Set ${
          user.username
        }'s balance to **${amount.value!.toLocaleString()}** #{blaze}`
      );
      break;
    case "add":
      user.balance.add(amount.value as number);
      data.embed(
        `Added to Balance`,
        `Added **${amount.value!.toLocaleString()}** #{blaze} to ${
          user.username
        }'s balance`
      );
      break;
    case "subtract":
      user.balance.add(amount.value as number);
      data.embed(
        `Subtracted from Balance`,
        `Subtracted **${amount.value!.toLocaleString()}** #{blaze} from ${
          user.username
        }'s balance`
      );
      break;
    case "view":
      data.embed(
        `Balance`,
        `${user.username}'s balance is **${(
          await user.balance.get()
        ).toLocaleString()}** #{blaze}`
      );
      break;
  }
}
