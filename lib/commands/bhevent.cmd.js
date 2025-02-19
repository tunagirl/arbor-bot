const { SlashCommandBuilder } = require("discord.js");

// export command object
module.exports = {
	data: new SlashCommandBuilder()
		.setName("bhevent")
		.setDescription("Schedule a server group event (chat + bluesky alerts)"),
	async execute(interaction) {
		await interaction.reply("event Scheduled xyz...");
	},
};
