import {CommandInteraction} from "discord.js";

const handle = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.reply("this ain't ready yet luv");
}
export default {handle};