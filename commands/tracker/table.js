import { readFileSync } from "node:fs";
import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { checkPerms } from "../../import_folders/functions.js";

const botconfig = JSON.parse(readFileSync("./config.json"));

// functions
/**
 *
 * @param {import("discord.js").Message<boolean>} message
 * @param {Map<string,"+"|"-"|"~">} map
 */
async function updateEmbed(message, map) {
	try {
		const embed = message.embeds[0];
		const newEmbed = new EmbedBuilder(embed);
		newEmbed.setFields(getFields(message, map));

		await message.edit({
			embeds: [newEmbed],
		});
	} catch (error) {
		console.log(error);
		await message.edit({
			components: [],
			content:
				"**Die Tabelle wurde gelöscht! Der Befehl muss neu gestartet werden.**",
		});
	}
}

/**
 *
 * @param {import("discord.js").Message<boolean>} message
 * @param {Map<string,"+"|"-"|"~">interaction} map
 */
function getFields(message, map) {
	/** @type {Map<string,"+"|"-"|"~">} */
	const keyMap = new Map([
		["✅Accepted:", "+"],
		["❌Declined:", "-"],
		["❔Maybe:", "~"],
	]);

	return message.embeds[0].fields.map((field) => {
		const key = keyMap.get(field.name);
		const ids = [...map.entries()]
			.filter(([_, value]) => value === key)
			.map(([key]) => key);

		const fieldValue = ids.map((id) => `<@${id}>`).join("\n");

		return {
			name: field.name,
			value:
				fieldValue.length > 0 && fieldValue.trim().length > 0
					? fieldValue
					: "\u200B",
			inline: true,
		};
	});
}

/** @type {{data: import("@discordjs/builders").SlashCommandBuilder, execute: (interaction: import("discord.js").MessageComponentInteraction) => Promise<void>}} */
export const data = new SlashCommandBuilder()
	.setName(`table`)
	.setDescription("Starte eine Tabelle!")
	.addStringOption((option) =>
		option
			.setName("title")
			.setDescription("Title der Tabelle")
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName("year")
			.setDescription("Jahr")
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName("month")
			.setDescription("Monat")
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName("day")
			.setDescription("Tag")
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName("hour")
			.setDescription("Bitte die Startzeit angeben. Default: 20:00")
			.setRequired(false)
	);

/*
		.addIntegerOption((option) =>
			option
				.setName("minute")
				.setDescription("Specify the starting time")
				.setRequired(true)
		),
		*/
export async function execute(client, interaction) {
	// check for permission
	const check = await checkPerms(
		interaction,
		null,
		botconfig.cwModRoleId,
		null
	);
	if (!check) return;

	// declare variables
	const title = interaction.options.getString("title");
	// Input date and time components
	const year = interaction.options.getInteger("year");
	const month = interaction.options.getInteger("month");
	const day = interaction.options.getInteger("day");
	const hours = interaction.options.getInteger("hour");
	const minutes = 0;
	const seconds = 0;

	// Create a Date object with the provided information
	const targetDate = new Date(year, month - 1, day, hours, minutes, seconds);

	// Get the Unix timestamp (in milliseconds) for the target time
	const targetTimestamp = targetDate.getTime();
	const startseconds = targetTimestamp / 1000;

	// Calculate the time remaining until the target time
	const timeRemaining = targetTimestamp - Date.now();

	// declare embed
	const tableEmbed = new EmbedBuilder({
		color: "880099",
		title: `${title}`,
		description: `⏲️ <t:${startseconds}:R>`,
		fields: [
			{ name: "✅Accepted:", value: "\u200B", inline: true },
			{ name: "❌Declined:", value: "\u200B", inline: true },
			{ name: "❔Maybe:", value: "\u200B", inline: true },
		],
		timestamp: Date.now(),
	});

	// declare buttons
	const Reactions = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setEmoji("✅").setCustomId("Yes").setStyle("Success"),
		new ButtonBuilder().setEmoji("❌").setCustomId("Cancel").setStyle("Danger"),
		new ButtonBuilder()
			.setEmoji("❔")
			.setCustomId("Maybe")
			.setStyle("Secondary")
	);

	// post message and embed with buttons
	await interaction.deferReply();
	await interaction.followUp({
		content: `${title} am <t:${startseconds}:f>! Tragt euch ein!`,
	});
	const message = await interaction.channel.send({
		embeds: [tableEmbed],
		components: [Reactions],
		fetchReply: true,
	});

	// remove buttons and send notification
	setTimeout(async () => {
		await message.edit({ components: [] });
		await interaction.channel.send(
			`<@&${botconfig.mannschafter1RoleId}><@&${botconfig.mannschafter2RoleId}><@&${botconfig.mannschafter3RoleId}> ${title} geht los!`
		);
	}, timeRemaining);

	// button collector
	const buttonCollector = interaction.channel.createMessageComponentCollector({
		filter: (m) =>
			m.customId === "Yes" || m.customId === "Cancel" || m.customId === "Maybe",
		timeRemaining,
	});

	/** @type {Map<string,"+"|"-"|"~">} */
	const tableMap = new Map();

	buttonCollector.on("collect", async (buttonInteraction) => {
		switch (buttonInteraction.customId) {
			case "Yes": {
				if (tableMap.get(buttonInteraction.user.id) === "+") {
					await buttonInteraction.reply({
						content: `Du bist schon dem ${title} beigetreten!`,
						ephemeral: true,
					});
					return;
				}

				tableMap.set(buttonInteraction.user.id, "+");
				//                    buttonInteraction.member.roles.add(cwRoleId)
				await buttonInteraction.reply({
					content: `Du bist dem ${title} beigetreten.`,
					ephemeral: true,
				});
				break;
			}

			case "Cancel": {
				if (tableMap.get(buttonInteraction.user.id) === "-") {
					await buttonInteraction.reply({
						content: `Du hast den ${title} schon abgelehnt!`,
						ephemeral: true,
					});
					return;
				}

				tableMap.set(buttonInteraction.user.id, "-");
				//                    buttonInteraction.member.roles.remove(cwRoleId)
				await buttonInteraction.reply({
					content: `Du hast den ${title} abgelehnt.`,
					ephemeral: true,
				});
				break;
			}

			case "Maybe": {
				if (tableMap.get(buttonInteraction.user.id) === "~") {
					await buttonInteraction.reply({
						content: `Du bist bereits als moeglicher Teilnehmer eingetragen!`,
						ephemeral: true,
					});
					return;
				}

				tableMap.set(buttonInteraction.user.id, "~");
				//                    buttonInteraction.member.roles.add(cwRoleId)
				await buttonInteraction.reply({
					content: `Du hast dich als moeglicher Teilnehmer eingetragen.`,
					ephemeral: true,
				});
				break;
			}

			default: {
				console.log("Something Broke");
				await buttonInteraction.reply({
					content: "Something Broke",
					ephemeral: true,
				});
				break;
			}
		}

		updateEmbed(message, tableMap);
	});
}
