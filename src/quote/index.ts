import { ChatInputCommandInteraction, messageLink } from "discord.js";
import add from "./add";
import { Quote } from "../db";
import { Sequelize } from "sequelize";

const count = async (interaction: ChatInputCommandInteraction): Promise<void> => {

  const username = interaction.options.getUser('user')?.username;

  if (username) {
    const quoteCount = await Quote.count({ where: { user: username, guildId: interaction.guildId ?? "" } });

    await interaction.reply(`We have a total of ${quoteCount} quotes by ${username}.`);
    return;
  }

  const quoteCount = await Quote.count({ where: { guildId: interaction.guildId ?? "" } });

  await interaction.reply(`We have a total of ${quoteCount} quotes.`);
}
const random = async (interaction: ChatInputCommandInteraction): Promise<void> => {

  const [randomQuote] = await Quote.findAll({
    where: { guildId: interaction.guildId ?? "" },
    order: Sequelize.literal('RANDOM()'),
    limit: 1
  });

  if (!randomQuote) {
    await interaction.reply("There are no quotes in this bot");
    return;
  }

  await interaction.reply(`${randomQuote.content}\n- ${randomQuote.user}\n${messageLink(randomQuote.channelId, randomQuote.messageId, randomQuote.guildId)}`);
}

const handle = async (interaction: ChatInputCommandInteraction): Promise<void> => {

  const subCommand = interaction.options.getSubcommand();

  switch (subCommand) {
    case "count":
      return await count(interaction);
    case "random":
      return await random(interaction);
    default:
      await interaction.reply("this ain't ready yet luv: ");
      return;
  }

}
export default { handle, add };
