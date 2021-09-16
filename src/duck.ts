import {CommandInteraction} from "discord.js";
import https from "https";

interface Duck {
  url: string;
}

const handle = async (interaction: CommandInteraction): Promise<void> => {

  const randomDuck: Duck = await new Promise((resolve) => {
    https.get("https://random-d.uk/api/v2/random", res => {
      let data = "";
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(data));
      })
    })
  })
  await interaction.reply({isMessage: true, files: [randomDuck?.url]});
}
export default {handle};