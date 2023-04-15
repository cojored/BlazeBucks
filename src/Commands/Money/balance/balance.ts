import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import { ApplicationCommandOptionType } from "discord.js";
import execute from "./execute.js";

let command = new SlashCommand({
  name: "balance",
  description: "Balance Stuff",
  options: [
    {
      name: "admin",
      description: "Admin Options",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "Set a users balance",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get the balance of",
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
        },
        {
          name: "add",
          description: "Add to a users balance",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get the balance of",
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
        },
        {
          name: "subtract",
          description: "Subtract from a users balance",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get the balance of",
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
        },
      ],
    },
    {
      name: "view",
      description: "View a users balance",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to get the balance of",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
  ],
});

command.execute(execute);

export default command;
