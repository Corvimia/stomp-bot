import {ApplicationCommandData, CommandInteraction, Guild, User} from "discord.js";
import quote from "./quote";
import duck from "./duck";

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
          type: "SUB_COMMAND",
        },
        {
          name: "quote",
          description: "do some quotes management",
          type: "SUB_COMMAND_GROUP",
          options: [
            {
              name: "list",
              description: "list quotes",
              type: "SUB_COMMAND",
              options: [
                {
                  name: "user",
                  description: "the user to filter by",
                  type: "USER",
                  required: false
                }
              ]
            },
            {
              name: "random",
              description: "get a quote at random",
              type: "SUB_COMMAND"
            }
          ]
        },
        {
          name: "quit",
          description: "[ADMIN] kills this bot and restart",
          type: "SUB_COMMAND"
        },
        {
          name: "duck",
          description: "have a duck",
          type: "SUB_COMMAND"
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
          type: "SUB_COMMAND",
        },
        {
          name: "quit",
          description: "[ADMIN] kills this bot and restart",
          type: "SUB_COMMAND"
        },
        {
          name: "duck",
          description: "have a duck",
          type: "SUB_COMMAND"
        }
      ]
    }
  }
];

const getCurrentServerNickname = async (guild: Guild | null, user: User): Promise<string> => {
  if (!guild) {
    return "Nickname Not Found";
  }
  return (await guild?.members.fetch({user: user}))?.displayName;
}

const hello = async (interaction: CommandInteraction): Promise<void> => {
  console.log("Hello command called");
  await interaction.reply(`Hi ${await getCurrentServerNickname(interaction.guild, interaction.user)}`);
}
const quit = async (interaction: CommandInteraction): Promise<void> => {
  console.log("Quit command called");
  if (!["164441917394780160"].includes(interaction.user.id)) {
    await interaction.reply("Nice try :eyes:");
    return;
  }
  await interaction.reply("Why did you do this to me?! :(");
  process.exit(0);
}

const handle = async (interaction: CommandInteraction): Promise<void> => {
  console.log("Stomp command called");
  const command = interaction.options.data[0];

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