const { SlashCommandBuilder } = require("discord.js");

// export command object
module.exports = {
	data: new SlashCommandBuilder()
		.setName("bhserver")
		.setDescription("Generate a server report"),
	async execute(interaction) {
		await interaction.reply("This server is " + interaction.guild.name + " and has " + interaction.guild.member_count +" members");
	},
};
