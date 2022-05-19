const process = require("node:process");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("shows info about the bot"),
	async execute(interaction) {
		const ram = process.memoryUsage().heapUsed / 1024 / 1024;
		const ping = Date.now() - interaction.createdTimestamp;
		let totalSeconds = interaction.client.uptime / 1000;
		const uptimeDays = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		const uptimeHours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const uptimeMinutes = Math.floor(totalSeconds / 60);
		const uptimeSeconds = Math.floor(totalSeconds % 60);

		const InfoEmbed = new Discord.MessageEmbed()
			.setTitle("Bot Info")
			.setColor(interaction.member.displayHexColor)
			.setTimestamp()
			.addFields(
				{
					name: "Bot Name",
					value: `${interaction.client.user.tag}`,
					inline: true,
				},
				{ name: "RAM", value: `${ram.toFixed(2)}MB`, inline: true },
				{
					name: "Uptime",
					value: `${uptimeDays}d, ${uptimeHours}h, ${uptimeMinutes}m, ${uptimeSeconds}s`,
					inline: true,
				},
				{ name: "Bot Latency", value: `${ping}ms`, inline: true },
				{
					name: "API Latency",
					value: `${interaction.client.ws.ping}ms`,
					inline: true,
				}
			);
		await interaction.reply({ embeds: [InfoEmbed] });
	},
};
