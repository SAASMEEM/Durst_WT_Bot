import { memoryUsage, version as _version } from "node:process";
import { EmbedBuilder, version } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const SECONDS_IN_DAY = 86_400;

export const data = new SlashCommandBuilder()
	.setName("info")
	.setDescription("shows info about the bot");
export async function execute(client, interaction) {
	const ram = memoryUsage().heapUsed / 1024 / 1024;
	const ping = Date.now() - interaction.createdTimestamp;
	let totalSeconds = interaction.client.uptime / 1000;
	const d = Math.floor(totalSeconds / SECONDS_IN_DAY);
	totalSeconds %= SECONDS_IN_DAY;
	const h = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const m = Math.floor(totalSeconds / 60);
	const s = Math.floor(totalSeconds % 60);

	const InfoEmbed = new EmbedBuilder()
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
			{ name: "Node", value: `${_version}`, inline: true }
		);
	await interaction.reply({ embeds: [InfoEmbed] });
}
