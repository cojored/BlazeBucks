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
  name: "materials",
  description: "Materials Stuff",
  options: [
    {
      name: "admin",
      description: "Admin Options",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "set",
          description: "Set a users materials",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to set the materials of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "material",
              description: "The material",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "amount",
              description: "The amount to set the materials to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
        {
          name: "add",
          description: "Add to a users materials",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get the materials of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "material",
              description: "The material",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "amount",
              description: "The amount to set the materials to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
        {
          name: "subtract",
          description: "Subtract from a users materials",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "The user to get the materials of",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "material",
              description: "The material",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
            {
              name: "amount",
              description: "The amount to set the materials to",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "view",
      description: "View a users materials",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to get the materials of",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
    {
      name: "sell",
      description: "Sell your materials",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "material",
          description: "The material",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "amount",
          description: "The amount to sell (Enter -1 to sell all)",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
  ],
});

command.execute(execute);

command.autocomplete(function (
  interaction: AutocompleteInteraction<CacheType>
) {
  let current = interaction.options.getFocused();
  let options = Object.keys(MaterialType);
  options.push("All");
  let filtered = options.filter((choice) =>
    choice.toLowerCase().startsWith(current)
  );

  interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
});

export default command;
