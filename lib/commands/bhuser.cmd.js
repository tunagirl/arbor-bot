const { SlashCommandBuilder } = require("discord.js");

// export command object
module.exports = {
	data: new SlashCommandBuilder()
		.setName("bhuser")
		.setDescription("Generate user report"),
	async execute(interaction) {
		await interaction.reply("User <@" + interaction.user.id + "> joined at " + interaction.member.joined_at);
	},
};
