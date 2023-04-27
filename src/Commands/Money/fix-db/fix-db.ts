import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import { cooldowns, db } from "../../../index.js";
import { EmbedBuilder } from "discord.js";

async function getIds(d: string, c: string) {
  return db
    .db(d)
    .collection(c)
    .aggregate([
      { $group: { _id: "$id", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: "$_id", _id: 0 } },
    ])
    .toArray()
    .then((x) => x);
}

async function combine(d: string, c: string, id: string) {
  let json = await db.db(d).collection(c).find({ id: id }).toArray();
  let final: { [key: string]: string } = {};
  for (let i of json) {
    for (let [key, value] of Object.entries(i)) {
      if (final[key] && final[key] != value && typeof final[key] === "number")
        final[key] += value;
      else if (!final[key]) final[key] = value;
    }
  }
  await db.db(d).collection(c).deleteMany({ id: id });
  await db.db(d).collection(c).insertOne(final);
}

async function run(data: InteractionCommandData) {
  let now = new Date().getTime();
  if (!(now >= cooldowns.db + 600000) && cooldowns.db)
    return data.error("This command can only be run once every 10 minutes");

  cooldowns.db = now;
  let embed = new EmbedBuilder().setTitle("Fixing DB");
  data.reply(embed).then(async (x) => {
    await Promise.all(
      (
        await getIds("economy", "balance")
      ).map((x) => combine("economy", "balance", x.name))
    );
    await Promise.all(
      (
        await getIds("material", "pickaxe")
      ).map((x) => combine("material", "pickaxe", x.name))
    );
    await Promise.all(
      (
        await getIds("material", "storage")
      ).map((x) => combine("material", "axe", x.name))
    );
    x.edit({ embeds: [embed.setTitle("DB Fixed")] });
  });
}

let command = new SlashCommand({
  name: "fix-db",
  description: "Fix the database",
});

command.execute(run);

export default command;
