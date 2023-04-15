import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import execute from "./execute.js";
import { shop } from "../../../index.js";
import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
} from "discord.js";

let command = new SlashCommand({
  name: "shop",
  description: "The shop",
  beta: true,
  options: [
    {
      name: "admin",
      description: "Admin commands",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "add",
          description: "Add an item to the shop",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "The name of the item",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "price",
              description: "The price of the item",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            },
            {
              name: "description",
              description: "The description of the item",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "Remove an item from the shop",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "id",
              description: "The id of the item",
              type: ApplicationCommandOptionType.Integer,
              required: true,
              autocomplete: true,
            },
          ],
        },
      ],
    },
    {
      name: "buy",
      description: "Buy an item from the shop",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The id of the item",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: "view",
      description: "View the shop",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The id of the item",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          autocomplete: true,
        },
      ],
    },
  ],
});

command.execute(execute);

command.autocomplete(async (interaction: AutocompleteInteraction) => {
  let shopItems = await shop.getAll();
  let items = shopItems.map((item) => item.id);

  let current = interaction.options.getFocused();
  let filtered = items.filter((choice) =>
    choice.toString().startsWith(current.toString())
  );

  interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
});

export default command;
