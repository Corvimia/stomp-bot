import {Client, Intents} from "discord.js";
import Stomp from "./stomp";


const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag ?? "Unknown"}!`);
});

client.on("interaction", async (interaction) => {
  if (!interaction.isCommand()) return;

  const commands = Stomp.commands.find(c => c.GuildId == interaction.guildId)?.Commands;

  if (!commands) {
    return;
  }

  try {
    if (interaction.commandName === commands.name) {
      await Stomp.handle(interaction);
    }
  } catch (e) {
    console.log(e);
    await interaction.reply("there was an issue: " + e.message);
  }
})

client.once("ready", () => {
  for (const guildCommand of Stomp.commands) {
    client.guilds.cache.get(guildCommand.GuildId)?.commands.create(guildCommand.Commands)
  }
  console.log("Commands created");
})


export default client;