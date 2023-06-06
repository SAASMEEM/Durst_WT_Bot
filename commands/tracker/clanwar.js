import { readFileSync } from "node:fs";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from "discord.js";
import { checkPerm } from "../../import_folders/functions.js";

const botconfig = JSON.parse(readFileSync("./config.json"));

// functions
/**
 *
 * @param {import("discord.js").Message<boolean>} message
 * @param {Map<string,"+"|"-"|"~">} map
 */
async function updateEmbed(message, map) {
	try {
		message.embeds[0].fields = getFields(message, map);
		await message.edit({
			embeds: message.embeds,
		});
	} catch {
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

	return message.embeds[0].fields.map((old) => {
		const key = keyMap.get(old.name);
		if (!key) {
			console.error("Something has gone terribly wrong here!");
			return undefined;
		}

		const ids = [...map].filter((v) => v[1] === key).map((v) => v[0]);

		return {
			name: old.name,
			value: `\u200B${ids.map((id) => `<@${id}>\n `).join("")}`,
			inline: true,
		};
	});
}

/** @type {{data: import("@discordjs/builders").SlashCommandBuilder, execute: (interaction: import("discord.js").MessageComponentInteraction) => Promise<void>}} */
export const data = new SlashCommandBuilder()
	.setName(`clanwar`)
	.setDescription("Starte einen Clanwar!")
	.addStringOption((option) =>
		option
			.setName("battlerank")
			.setDescription("Aktuelles Battle Ranking")
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
	const check = await checkPerm(interaction, "MENTION_EVERYONE");
	if (!check) return;

	// declare variables
	const br = interaction.options.getString("battlerank");
	const inserthour = interaction.options.getInteger("hour");
	//		const insertminute = interaction.options.getInteger("minute");
	const defaulthour = botconfig.defaultTime;
	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();
	const hour = d.getHours();
	const minute = d.getMinutes();
	const second = d.getSeconds();
	let starttime = null;
	starttime =
		inserthour === null || inserthour === undefined ? defaulthour : inserthour;

	const date = new Date(year, month, day, hour, minute, second);
	const dateseconds = date.getTime() / 1000;
	const start = new Date(year, month, day, starttime, 0, 0);
	const startseconds = start.getTime() / 1000;
	const time = startseconds * 1000 - dateseconds * 1000;

	// declare embed
	const tableEmbed = new EmbedBuilder({
		color: "880099",
		title: `Clanwar (${br})`,
		description: `⏲️ <t:${startseconds}:R>\n[Checkliste](https://shorturl.at/kLNZ9)\n[Fahrzeugaufstellung](https://shorturl.at/lnH49)`,
		fields: [
			{ name: "✅Accepted:", value: "\u200B", inline: true },
			{ name: "❌Declined:", value: "\u200B", inline: true },
			{ name: "❔Maybe:", value: "\u200B", inline: true },
		],
		timestamp: Date.now(),
	});

	// declare buttons
	const Reactions = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setEmoji("✅").setCustomId("Yes").setStyle("SUCCESS"),
		new ButtonBuilder().setEmoji("❌").setCustomId("Cancel").setStyle("DANGER"),
		new ButtonBuilder()
			.setEmoji("❔")
			.setCustomId("Maybe")
			.setStyle("SECONDARY")
	);

	// post message and embed with buttons
	await interaction.deferReply();
	await interaction.followUp({
		content: `CW um ${starttime}:00 Uhr! Tragt euch ein!`,
	});
	const message = await interaction.channel.send({
		embeds: [tableEmbed],
		components: [Reactions],
		fetchReply: true,
	});

	// remove buttons and send notification
	setTimeout(async () => {
		await message.edit({ components: [] });
		await interaction.channel.send(`<@&${botconfig.cwRoleId}> CW!`);
	}, time);

	// button collector
	const buttonCollector = interaction.channel.createMessageComponentCollector({
		filter: (m) =>
			m.customId === "Yes" || m.customId === "Cancel" || m.customId === "Maybe",
		time,
	});

	/** @type {Map<string,"+"|"-"|"~">} */
	const tableMap = new Map();

	buttonCollector.on("collect", async (buttonInteraction) => {
		if (!buttonInteraction.member.roles.cache.has(botconfig.cwRoleId)) {
			await buttonInteraction.reply({
				content: `Nur <@&${botconfig.cwRoleId}>-Mitlgieder koennen sich zum Clanwar eintragen!\nBitte lies dir die [Checkliste](https://shorturl.at/kLNZ9)_sorgfaeltig_ durch.\nSobald du dies getan hast kannst du dich an einen CW-Mod.`,
				ephemeral: true,
			});
			return;
		}

		switch (buttonInteraction.customId) {
			case "Yes": {
				if (tableMap.get(buttonInteraction.user.id) === "+") {
					await buttonInteraction.reply({
						content: `Du bist schon dem Clanwar beigetreten!`,
						ephemeral: true,
					});
					return;
				}

				tableMap.set(buttonInteraction.user.id, "+");
				//                    buttonInteraction.member.roles.add(cwRoleId)
				await buttonInteraction.reply({
					content: `Du bist dem Clanwar beigetreten.`,
					ephemeral: true,
				});
				break;
			}

			case "Cancel": {
				if (tableMap.get(buttonInteraction.user.id) === "-") {
					await buttonInteraction.reply({
						content: `Du hast den Clanwar schon abgelehnt!`,
						ephemeral: true,
					});
					return;
				}

				tableMap.set(buttonInteraction.user.id, "-");
				//                    buttonInteraction.member.roles.remove(cwRoleId)
				await buttonInteraction.reply({
					content: `Du hast den Clanwar abgelehnt.`,
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
