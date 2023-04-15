import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteraction,
  CommandInteractionOption,
} from "discord.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import BlazeUser from "../../../Types/Classes/Blaze/BlazeUser.js";
import MaterialType from "../../../Types/Interfaces/MaterialType.js";
import { config } from "../../../index.js";

const sell_values: { [key: string]: number } = config.sell_values;

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
  let material = data.getOption(
    "material"
  ) as CommandInteractionOption<CacheType>;

  if (user.bot) return data.error("You can't do that to a bot");

  /*if (
    !Object.keys(MaterialType).includes(material?.value as string) &&
    material
  )
    return data.error("Invalid material");*/

  switch (command) {
    case "set":
      user.material.set(
        material.value as string as MaterialType,
        amount.value as number
      );
      data.embed(
        `${material.value} Set`,
        `Set ${user.username}'s ${
          material.value
        } to **${amount.value!.toLocaleString()}** #{${material.value}}`
      );
      break;
    case "add":
      user.material.add(
        material.value as string as MaterialType,
        amount.value as number
      );
      data.embed(
        `Added to ${material.value}`,
        `Added **${amount.value!.toLocaleString()}** #{${material.value}} to ${
          user.username
        }'s ${material.value}`
      );
      break;
    case "subtract":
      user.material.subtract(
        material.value as string as MaterialType,
        amount.value as number
      );
      data.embed(
        `Subtracted from ${material.value}`,
        `Subtracted **${amount.value!.toLocaleString()}** #{${
          material.value
        }} from ${user.username}'s ${material.value}`
      );
      break;
    case "view":
      data.embed(
        `${user.username}'s Materials`,
        await user.material.allString()
      );
      break;
    case "sell":
      if (
        (material.value as string).toLowerCase() === "all" &&
        (amount.value as number) != -1
      )
        return data.error("You can't sell all materials for a specific amount");

      if ((material.value as string).toLowerCase() === "all") {
        await (data._data as CommandInteraction).deferReply();
        let total = 0;
        await Promise.all(
          Object.keys(MaterialType).map(async (material) => {
            let amount =
              sell_values[material] *
              (await user.material.get(material as MaterialType));
            await user.balance.add(
              sell_values[material] *
                (await user.material.get(material as MaterialType))
            );
            user.material.set(material as MaterialType, 0);
            total += amount;
          })
        );
        (data._data as CommandInteraction).editReply({
          embeds: [
            {
              title: `Sold All Materials`,
              description: data.replace(
                `Sold all materials for **${total.toLocaleString()}** #{blaze}`
              ),
            },
          ],
        });
      } else {
        let current = await user.material.get(
          material.value as string as MaterialType
        );

        if ((amount.value as number) === -1) amount.value = current;

        if (current < (amount.value as number) || current === 0)
          return data.error(
            "You don't have enough materials to sell that amount"
          );

        if ((amount.value as number) <= 0)
          return data.error("You can't sell negative materials");

        await user.material.subtract(
          material.value as string as MaterialType,
          amount.value as number
        );
        await user.balance.add(
          sell_values[material.value as string] * (amount.value as number)
        );
        data.embed(
          `Sold ${(amount.value as number).toLocaleString()} #{${
            material.value
          }}`,
          `You sold ${(amount.value as number).toLocaleString()} #{${
            material.value
          }} for **${(
            sell_values[material.value as string] * (amount.value as number)
          ).toLocaleString()}** #{blaze}`
        );
      }
      break;
  }
}
