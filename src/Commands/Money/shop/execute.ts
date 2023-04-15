import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
} from "discord.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import { shop } from "../../../index.js";

export default async function execute(data: InteractionCommandData) {
  let group = (
    data._data as ChatInputCommandInteraction
  ).options.getSubcommandGroup();
  let command = (
    data._data as ChatInputCommandInteraction
  ).options.getSubcommand();

  if (group === "admin" && !data.author.admin)
    return data.error("You are not an admin");

  let user = data.author;
  let id = data.getOption("id") as CommandInteractionOption<CacheType>;
  let name = data.getOption("name") as CommandInteractionOption<CacheType>;
  let description = data.getOption(
    "description"
  ) as CommandInteractionOption<CacheType>;
  let price = data.getOption("price") as CommandInteractionOption<CacheType>;

  if (user.bot) return data.error("You can't do that to a bot");

  switch (command) {
    case "add":
      if (!name?.value || !description?.value || !price?.value)
        return data.error("Missing arguments");
      let randomId = Math.floor(Math.random() * 1000);
      shop.create(
        randomId,
        name.value as string,
        description.value as string,
        price.value as number
      );
      data.embed(
        `Added to Shop`,
        `Added **${name.value}** to the shop for **${price.value}** #{blaze}`
      );
      break;
    case "remove":
      if (!id.value) return data.error("Missing arguments");
      shop.delete(id.value as number);
      data.embed(`Removed Item`, `Removed item with id **${id.value}**`);
      break;
    case "buy":
      if (!id.value) return data.error("Missing arguments");
      let item = await shop.get(id.value as number);

      if (!item) return data.error("Item not found");
      if (!item.price) return data.error("Item is not for sale");

      if (item.price > (await user.balance.get()))
        return data.error("You don't have enough money");

      user.balance.subtract(item.price);
      data.embed(
        `Bought Item`,
        `Bought **${
          item.name
        }** for **${item.price.toLocaleString()}** #{blaze}`
      );
      break;
    case "view":
      let embed = new EmbedBuilder();
      if (id?.value) {
        let item = await shop.get(id.value as number);
        if (!item) return data.error("Item not found");
        embed.setTitle(data.replace(item.name ?? "Item"));
        embed.setDescription(
          data.replace(item.description ?? "No description")
        );
        if (data.replace(`#{shop_${id.value}_image}`) != "undefined")
          embed.setThumbnail(data.replace(`#{shop_${id.value}_image}`));
        embed.addFields([
          {
            name: "Price",
            value: data.replace(
              (item.price?.toLocaleString() ?? "No price") + " #{blaze}"
            ),
            inline: true,
          },
          {
            name: "ID",
            value: item.id?.toLocaleString() ?? "No ID",
            inline: true,
          },
        ]);
      } else {
        let shopItems = await shop.getAll();

        embed.setTitle("Shop");
        embed.setDescription(
          data.replace(
            shopItems
              .map((item) => {
                return `**${item.name} (ID: ${item.id})** - ${item.description} - ${item.price} #{blaze}`;
              })
              .join("\n")
          )
        );
      }

      data.reply(embed);
      break;
  }
}
