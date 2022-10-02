import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { Quote } from "../db";

export default async (messageReaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): Promise<void> => {
  if (messageReaction.partial) {
    try {
      await messageReaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  }

  console.log(`${messageReaction.message.author?.username}'s message "${messageReaction.message.content}" gained a reaction by ${user.username}!`);

  await Quote.create({
    content: messageReaction.message.content ?? "no content",
    user: messageReaction.message.author?.username ?? "no username",
    channelId: messageReaction.message.channelId,
    messageId: messageReaction.message.id,
    guildId: messageReaction.message.guildId ?? "no guild id",
    added_by: user.username ?? "no username",
  })

  await messageReaction.message.react("1026059908325580820");
};
