import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import BlazeUser from "../../../Types/Classes/Blaze/BlazeUser.js";
import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  CacheType,
} from "discord.js";
import execute from "./execute.js";
import MaterialType from "../../../Types/Interfaces/MaterialType.js";

let command = new SlashCommand({
  name: "pickaxe",
  description: "Pickaxe Stuff",
  options: [
    {
      name: "admin",
      description: "Admin Options",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "Set a users pickaxe level",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to set the pickaxe level of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "amount",
              description: "The amount to set the pickaxe level to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
        {
          name: "add",
          description: "Add to a users pickaxe level",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to add to the pickaxe level of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "amount",
              description: "The amount to set the pickaxe to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
        {
          name: "subtract",
          description: "Subtract from a users pickaxe level",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to subtract from the pickaxe level of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "amount",
              description: "The amount to set the pickaxe to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "view",
      description: "View a users pickaxe",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to get the pickaxe of",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
    {
      name: "upgrade",
      description: "Upgrade your pickaxe",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
});

command.execute(execute);

command.autocomplete(function (
  interaction: AutocompleteInteraction<CacheType>
) {
  let current = interaction.options.getFocused();
  let filtered = Object.keys(MaterialType).filter((choice) =>
    choice.toLowerCase().startsWith(current)
  );

  interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
});

export default command;
