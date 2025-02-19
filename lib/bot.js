// require necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require("discord.js");
const path = require("path");
const fs = require("fs");

// load bot slash commands from ./commands/ directory
function loadSlashCommands(){
	// create filepath and read commands directory
	const folderPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

	// create new collection to receive command objects
	let commands = new Collection();

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = require(filePath);

		if ("data" in command && "execute" in command) {
			commands.set(command.data.name, command);
		} else {
			console.log("[?] the command at `" + filePath + "` is missing a required 'data' or 'execute' property.");
		}
	}

	return commands;
}

// export bot initalization as an anonymous function
module.exports = function() {
	// create new bot client instance
	process.stdout.write("[.] initializing client... ");
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });


	// handle Client ClientReady event
	client.once(Events.ClientReady, (readyClient) => {
		// report login info
		console.log("[.] done\n[.] logged in as: " + readyClient.user.tag);

		// load commands into client object
		process.stdout.write("[.] loading bot commands... ");
		client.commands = loadSlashCommands();
		console.log("done (loaded " + client.commands.size + " commands)");
	});

	// handle Client InteractionCreate event
	client.on(Events.InteractionCreate, async (interaction) => {
		if (! interaction.isChatInputCommand()) return;

		// get command from interaction command name
		const command = interaction.client.commands.get(interaction.commandName);
		// error checking
		if (! command) console.error("[!] no command matching '" + interaction.commandName + "' was found.");

		// try to execute command syncronously
		try {
			await command.execute(interaction);
		// report errors
		} catch (error) {
			console.error(error);

			let callback;

			if (interaction.replied || interaction.deferred) {
				callback = interaction.followUp;
			} else {
				callback = interaction.reply;
			}

			// reply to user with error message
			await callback({
				content: "There was an error while executing this command!\n```"+error+"```",
				flags: MessageFlags.Ephemeral,
			});
		}
	});

	// return bot data in object for use in index.js
	return {
		token: process.env.BOT_TOKEN,
		pubkey: process.env.BOT_PUBLIC_KEY,
		client: client,
	};
};
