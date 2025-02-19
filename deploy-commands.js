// load .env file environment variables, i.e. discord.js token and pub key
require("dotenv").config();

const { REST, Routes } = require('discord.js');
const path = require("path");
const fs = require("fs");

// create filepath and read commands directory
const folderPath = path.join(__dirname, "lib", "commands");
const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

// create new collection to receive command objects
let commands = [];

for (const file of commandFiles) {
	const filePath = path.join(folderPath, file);
	const command = require(filePath);

	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log("[?] the command at `" + filePath + "` is missing a required 'data' or 'execute' property.");
	}
}

// deploy commands asyncronously to free up main thread
(async () => {
	// create new REST object to register commands
	const rest = new REST().setToken(process.env.BOT_TOKEN);

	try {
		process.stdout.write("[.] refreshing " + commands.length + " application (/) commands... ");

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.SERVER_ID),
			{ body: commands }
		);
		console.log("done (reloaded " + data.length + " commands)");
	} catch (error) {
		console.error(error);
	}
})();
