import { Client, Intents } from "discord.js";
import Stomp from "./stomp";
import twitter from "./twitter";


const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag ?? "Unknown"}!`);
});

client.on("messageCreate", async message => {
  const { content } = message;

  const meta = await twitter.getTweetMeta(content);

  console.log("twitter checked", meta);

  if(!meta.isTwitter){
    return;
  }

  if (meta.thread > 0) {
    await message.react('🧵');
  }

  if (meta.images > 1) {
    await message.react('🖼️');
  }
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
  } catch (e: any) {
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
