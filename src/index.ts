import client from "./client";
import dotenv from "dotenv";

dotenv.config({path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`});

console.log("Logging in", {env: process.env.NODE_ENV, token: process.env.BOT_TOKEN})

client.login(process.env.BOT_TOKEN);

