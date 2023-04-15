import SlashCommand from "../../../Types/Classes/SlashCommand.js";
import { InteractionCommandData } from "../../../Types/Classes/CommandData.js";
import { config } from "../../../index.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import MaterialType from "../../../Types/Interfaces/MaterialType.js";
import Mine from "../../../Types/Classes/Blaze/Mine.js";

function blank() {
  return new ButtonBuilder()
    .setCustomId(Math.random().toString(36).substring(2, 7))
    .setLabel("‎")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
}

function buttons(width: number, height: number, position: number[]) {
  const top = new ActionRowBuilder<ButtonBuilder>();
  const middle = new ActionRowBuilder<ButtonBuilder>();
  const bottom = new ActionRowBuilder<ButtonBuilder>();

  top.addComponents(
    blank(),
    new ButtonBuilder()
      .setCustomId("mine|up")
      .setEmoji("⬆️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(position[0] === 0),
    blank()
  );

  middle.addComponents(
    new ButtonBuilder()
      .setCustomId("mine|left")
      .setEmoji("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(position[1] === 0),
    blank(),
    new ButtonBuilder()
      .setCustomId("mine|right")
      .setEmoji("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(position[1] === width - 1)
  );

  bottom.addComponents(
    blank(),
    new ButtonBuilder()
      .setCustomId("mine|down")
      .setEmoji("⬇️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(position[0] === height - 1),
    blank()
  );
  return [top, middle, bottom];
}

async function run(data: InteractionCommandData) {
  let mine = new Mine(data.author, config.mine_size[0], config.mine_size[1]);

  await mine.generateTable();

  let embed = new EmbedBuilder();
  embed.setTitle("Mine the Ores!");
  embed.setDescription(data.replace(mine.render()));
  embed.setFooter({
    text: "You are the pickaxe. Move with the buttons below, you have 60 seconds.",
  });

  data._data
    .reply({
      embeds: [embed],
      components: buttons(mine.width, mine.height, mine.playerPosition),
    })
    .then((msg) => {
      let collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", (i): any => {
        if (i.customId.split("|")[0] === "mine") i.deferUpdate();

        if (i.user.id != data.author.id) return;

        switch (i.customId.split("|")[1]) {
          case "up":
            mine.mine(mine.playerPosition[0] - 1, mine.playerPosition[1]);
            break;
          case "down":
            mine.mine(mine.playerPosition[0] + 1, mine.playerPosition[1]);
            break;
          case "left":
            mine.mine(mine.playerPosition[0], mine.playerPosition[1] - 1);
            break;
          case "right":
            mine.mine(mine.playerPosition[0], mine.playerPosition[1] + 1);
            break;
        }

        embed.setDescription(data.replace(mine.render()));

        msg.edit({
          embeds: [embed],
          components: buttons(mine.width, mine.height, mine.playerPosition),
        });

        if (mine.empty) collector.stop();
      });

      collector.on("end", async () => {
        embed = new EmbedBuilder();
        embed.setTitle("Mining Completed");
        let materials = await mine.calculateMaterials();

        embed.setDescription(
          data.replace(
            `You collected the following ores:\n${Object.keys(materials)
              .map((x) => `${x}: **${materials[x].toLocaleString()}** #{${x}}`)
              .join("\n")}`
          )
        );

        Object.keys(materials).forEach((x) => {
          data.author.material.add(x as MaterialType, materials[x]);
        });

        msg
          .edit({ embeds: [embed], components: [] })
          .catch((x: any) => console.log("Message not found"));
      });
    });
}

let command = new SlashCommand({
  name: "mine",
  description: "Mine for materials",
});

command.execute(run);

export default command;
