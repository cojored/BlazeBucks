import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import BlazeUser from "../../../Types/Classes/Blaze/BlazeUser.js";
import {
  ApplicationCommandOptionType,
  CacheType,
  CommandInteractionOption,
} from "discord.js";

async function run(data: InteractionCommandData) {
  let from = data.author;
  let to = data.getOption("user") as BlazeUser;
  let amount = (data.getOption("amount") as CommandInteractionOption<CacheType>)
    .value as number;

  if (from.id === to.id) return data.error("You can't pay yourself");
  if (to.bot) return data.error("You can't pay a bot");
  if (amount <= 0) return data.error("You can't pay a negative or zero amount");
  if ((await from.balance.get()) < amount)
    return data.error("You don't have enough money to pay that amount");

  await from.balance.subtract(amount);
  await to.balance.add(amount);

  data.embed(
    "Payment Sent",
    "You sent **" + amount.toLocaleString() + "** #{blaze} to " + to.username
  );
}

let command = new SlashCommand({
  name: "pay",
  description: "Pay a user",
  options: [
    {
      name: "user",
      description: "The user to pay",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "amount",
      description: "The amount to set the balance to",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
});

command.execute(run);

export default command;
