import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Guild,
  User
} from "discord.js";
import quote from "./quote";
import duck from "./duck";
import tools from "./tools";

type GuildCommands = {
  GuildId: `${bigint}`,
  Commands: ApplicationCommandData,
}

const commands: GuildCommands[] = [
  {
    GuildId: "438032707088285697",
    Commands: {
      name: "stomp",
      description: "Do a Stomp Command",
      options: [
        {
          name: "hello",
          description: "say hello",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "quote",
          description: "Quote Commands",
          type: ApplicationCommandOptionType.SubcommandGroup,
          options: [
            {
              name: "count",
              description: "count quote for a specific user or total",
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: "user",
                  description: "the user to filter by",
                  type: ApplicationCommandOptionType.User,
                  required: false
                }
              ]
            },
            {
              name: "random",
              description: "get a quote at random",
              type: ApplicationCommandOptionType.Subcommand
            },
            {
              name: "analyse",
              description: "[ADMIN] go through all messages to find old quotes and save them",
              type: ApplicationCommandOptionType.Subcommand
            }
          ]
        },
        {
          name: "quit",
          description: "[ADMIN] kills this bot and restart",
          type: ApplicationCommandOptionType.Subcommand
        },
        {
          name: "duck",
          description: "have a duck",
          type: ApplicationCommandOptionType.Subcommand
        }
      ]
    }
  },
  {
    GuildId: "339812887130406913",
    Commands: {
      name: "stomp",
      description: "Do a Stomp Command",
      options: [
        {
          name: "hello",
          description: "say hello",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "quote",
          description: "Quote Commands",
          type: ApplicationCommandOptionType.SubcommandGroup,
          options: [
            {
              name: "count",
              description: "count quote for a specific user or total",
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                {
                  name: "user",
                  description: "the user to filter by",
                  type: ApplicationCommandOptionType.User,
                  required: false
                }
              ]
            },
            {
              name: "random",
              description: "get a quote at random",
              type: ApplicationCommandOptionType.Subcommand
            },
            {
              name: "analyse",
              description: "[ADMIN] go through all messages to find old quotes and save them",
              type: ApplicationCommandOptionType.Subcommand
            }
          ]
        },
        {
          name: "quit",
          description: "[ADMIN] kills this bot and restart",
          type: ApplicationCommandOptionType.Subcommand
        },
        {
          name: "duck",
          description: "have a duck",
          type: ApplicationCommandOptionType.Subcommand
        }
      ]
    }
  }
];

const getCurrentServerNickname = async (guild: Guild | null, user: User): Promise<string> => {
  if (!guild) {
    return "Nickname Not Found";
  }
  return (await guild?.members.fetch({ user: user }))?.displayName ?? "Nickname Not Found";
}

const hello = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply(`Hi ${await getCurrentServerNickname(interaction.guild, interaction.user)}`);
}

const quit = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  if (!tools.isAdmin(interaction.user)) {
    await interaction.reply("Nice try :eyes:");
    return;
  }
  await interaction.reply("Why did you do this to me?! :(");
  process.exit(0);
}

const handle = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const command = interaction.options.data[0];

  console.log("Stomp command called", command?.name);

  switch (command?.name) {
    case "hello":
      await hello(interaction);
      break;
    case "quit":
      await quit(interaction);
      break;
    case "quote":
      await quote.handle(interaction)
      break;
    case "duck":
      await duck.handle(interaction);
      break;
    default:
      await interaction.reply("What in the bloody hell is this?!");
      break;
  }
}

export default {
  handle,
  commands,
}
