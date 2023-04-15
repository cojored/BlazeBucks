import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  EmbedBuilder,
} from "discord.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import BlazeUser from "../../../Types/Classes/Blaze/BlazeUser.js";
import MaterialType from "../../../Types/Interfaces/MaterialType.js";

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
      data.author.pickaxe.setLevel(amount.value as number);
      data.embed(
        `Set ${user.username}'s pickaxe level`,
        `Set ${user.username}'s pickaxe level to ${amount.value}`
      );
      break;
    case "add":
      data.author.pickaxe.addLevel(amount.value as number);
      data.embed(
        `Added to ${user.username}'s pickaxe level`,
        `Added ${amount.value} to ${user.username}'s pickaxe level`
      );
      break;
    case "subtract":
      data.author.pickaxe.subtractLevel(amount.value as number);
      data.embed(
        `Subtracted from ${user.username}'s pickaxe level`,
        `Subtracted ${amount.value} from ${user.username}'s pickaxe level`
      );
      break;
    case "view":
      let embed = new EmbedBuilder();
      let type = (await user.pickaxe.type()).toLowerCase();
      let level = await user.pickaxe.level();
      let upgradeCost = {
        Iron: 50 * level,
        Gold: 40 * level,
        Diamond: 30 * level,
        Emerald: 20 * level,
      };

      embed.setTitle(`${user.username}'s Pickaxe`);
      embed.setThumbnail(data.replace(`#{${type}_image}`));
      embed.addFields(
        {
          name: "Level",
          value: data.replace(`${level.toLocaleString()} #{${type}}`),
          inline: true,
        },
        {
          name: "Next Upgrade Requierments",
          value: data.replace(`
          ${upgradeCost.Iron.toLocaleString()} #{iron}
          ${upgradeCost.Gold.toLocaleString()} #{gold}
          ${upgradeCost.Diamond.toLocaleString()} #{diamond}
          ${upgradeCost.Emerald.toLocaleString()} #{emerald}
          `),
          inline: true,
        }
      );
      data.reply(embed);
      break;

    case "upgrade":
      let lvl = await user.pickaxe.level();
      let upCost = {
        Iron: 50 * lvl,
        Gold: 40 * lvl,
        Diamond: 30 * lvl,
        Emerald: 20 * lvl,
      };
      let materials = await user.material.all();

      if (
        (materials.Iron ?? 0) < upCost.Iron ||
        (materials.Gold ?? 0) < upCost.Gold ||
        (materials.Diamond ?? 0) < upCost.Diamond ||
        (materials.Emerald ?? 0) < upCost.Emerald
      )
        return data.error(
          `You don't have enough materials to upgrade your pickaxe`
        );

      user.material.subtract(MaterialType.Iron, upCost.Iron);
      user.material.subtract(MaterialType.Gold, upCost.Gold);
      user.material.subtract(MaterialType.Diamond, upCost.Diamond);
      user.material.subtract(MaterialType.Emerald, upCost.Emerald);

      user.pickaxe.setLevel(lvl + 1);
      data.embed(
        `Pickaxe Upgraded`,
        `Upgraded your pickaxe to level ${lvl + 1}`
      );
      break;
  }
}
