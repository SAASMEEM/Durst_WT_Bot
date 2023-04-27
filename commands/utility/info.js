const process = require("node:process");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { version } = require("discord.js");
const { checkPerm } = require("../../import_folders/functions");

const SECONDS_IN_DAY = 86_400;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("shows info about the bot"),
	async execute(client, interaction) {
		const ram = process.memoryUsage().heapUsed / 1024 / 1024;
		const ping = Date.now() - interaction.createdTimestamp;
		let totalSeconds = interaction.client.uptime / 1000;
		const d = Math.floor(totalSeconds / SECONDS_IN_DAY);
		totalSeconds %= SECONDS_IN_DAY;
		const h = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const m = Math.floor(totalSeconds / 60);
		const s = Math.floor(totalSeconds % 60);

		const InfoEmbed = new Discord.MessageEmbed()
			.setTitle("Bot Info")
			.setColor(interaction.member.displayHexColor)
			.setTimestamp()
			.addFields(
				{
					name: "Bot Name",
					value: `${interaction.client.user.tag}`,
					inline: false,
				},
				{ name: "RAM", value: `${ram.toFixed(2)}MB`, inline: false },
				{ name: "Uptime", value: `${d}d, ${h}h, ${m}m, ${s}s`, inline: true },
				{ name: "Bot Latency", value: `${ping}ms`, inline: false },
				{
					name: "API Latency",
					value: `${interaction.client.ws.ping}ms`,
					inline: true,
				},
				{ name: "Discord.js", value: `${version}`, inline: false },
				{ name: "Node", value: `${process.version}`, inline: true }
			);
		await interaction.reply({ embeds: [InfoEmbed] });
	},
};
