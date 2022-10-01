import { User } from "discord.js";

const isAdmin = (user: User): boolean => {
  return ["164441917394780160"].includes(user.id)
}

export default { isAdmin };
