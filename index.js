// load .env file environment variables, i.e. discord.js token and pub key
require("dotenv").config();

// load main discord bot object
let bot = require("./lib/bot.js")();

// log in with provided bot token environment variable (.env)
bot.client.login(process.env.BOT_TOKEN);
