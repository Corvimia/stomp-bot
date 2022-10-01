import { Client, GatewayIntentBits, Partials } from "discord.js";
import Stomp from "./stomp";
import twitter from "./twitter";
import quote from "./quote";
import { Quote } from "./db";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag ?? "Unknown"}!`);
});

client.on("messageReactionAdd", async (messageReaction, user) => {
  console.log("emoji added", `${messageReaction.emoji.name}@${messageReaction.emoji.id}`);
  // YG stomp 477433697100890112
  // stomp stomp 477434452864401409
  const emojiId = messageReaction.emoji.id!;
  if (["477434452864401409", "477433697100890112"].includes(emojiId)) {
    await quote.add(messageReaction, user);
  }
});

client.on("messageCreate", async message => {
  const { content } = message;

  const meta = await twitter.getTweetMeta(content);

  console.log("twitter checked", meta);

  if (!meta.isTwitter) {
    return;
  }

  if (meta.thread > 0) {
    await message.react('🧵');
  }

  if (meta.images > 1) {
    await message.react('🖼️');
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.isChatInputCommand()) return;

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

client.once("ready", async () => {
  for (const guildCommand of Stomp.commands) {
    try {
      await (await client.guilds.fetch(guildCommand.GuildId)).commands.create(guildCommand.Commands)

    } catch (e) {
      console.warn(`Could not add commands to guild ${guildCommand.GuildId}`);
    }
  }

  await Quote.sync();

  console.log("Commands created");
})


export default client;
