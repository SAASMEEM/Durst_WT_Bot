import { readFileSync } from "node:fs";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { checkPerm } from "../../import_folders/functions.js";

const botconfig = JSON.parse(readFileSync("./config.json"));

export const data = new SlashCommandBuilder()
	.setName("squadron")
	.setDescription("Kampfgruppenverwaltung")
	.addSubcommandGroup((subcommandgroup) =>
		subcommandgroup
			.setName("user")
			.setDescription("Verwalte die Mannschafter")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("remove")
					.setDescription("Entferne einen Mannschafter aus der Kampfgruppe")
					.addUserOption((option) =>
						option
							.setName("target")
							.setDescription("The user")
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Fuege einen Mannschafter yur kampfgruppe hinzu")
					.addUserOption((option) =>
						option
							.setName("target")
							.setDescription("The user")
							.setRequired(true)
					)
					.addIntegerOption((option) =>
						option
							.setName("role")
							.setDescription("Bitte waehle die Kampfguppe aus")
							.setRequired(true)
							.setChoices(
								{ name: "Mannschafter (Main)", value: 1 },
								{ name: "Mannschafter (zweite)", value: 2 },
								{ name: "Mannschafter (dritte)", value: 3 }
							)
					)
					.addStringOption((option) =>
						option
							.setName("nickname")
							.setDescription(
								'Setzte den Nickname des mannschafters. Schreibe "reset" um den Nicknamen yu entfernen.'
							)
							.setRequired(false)
					)
			)
	)
	.addSubcommandGroup((subcommandgroup) =>
		subcommandgroup
			.setName("clanwar")
			.setDescription("Verwalte die Clanwar Teilnehmer")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("remove")
					.setDescription("Entferne einen Mannschafter aus dem Clanwar team")
					.addUserOption((option) =>
						option
							.setName("target")
							.setDescription("The user")
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("add")
					.setDescription("Fuege einen Mannschafter ins Clanwar Team hinzu")
					.addUserOption((option) =>
						option
							.setName("target")
							.setDescription("The user")
							.setRequired(true)
					)
			)
	);
export async function execute(client, interaction) {
	// /user
	if (interaction.options.getSubcommandGroup() === "user") {
		// check for required permission
		const check = await checkPerm(interaction, "MANAGE_NICKNAMES");
		if (!check) return;
		// /user/remove
		if (interaction.options.getSubcommand() === "remove") {
			// get guildmember objecct from user object
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// manage roles
			member.roles.remove(botconfig.mannschafter1RoleId);
			member.roles.remove(botconfig.mannschafter2RoleId);
			member.roles.remove(botconfig.mannschafter3RoleId);
			member.roles.remove(botconfig.cwRoleId);
			// send feedback
			interaction.reply({
				content: `<@${user.id}> ist jetzt kein Mannschafter mehr!`,
				ephemeral: true,
			});
			// create embed for user DM
			const removeEmbed = new MessageEmbed({
				color: "2F3136",
				thumbnail: {
					url: `https://cdn.discordapp.com/icons/515253143580442660/d83147d1c4f5ebd03c71793a61ec0b5e.webp?size=96`,
				},
				title: `Nachricht von 🍻Durst🍻`,
				description: `[discord server](https://discord.gg/ecZR7WxMPt)`,
				fields: [
					{
						name: "Nachricht:",
						value: `Du wurdest aus der Ingame Kampfgruppe entfernt!`,
					},
					{
						name: "Warum:",
						value: `Unsere Ingame Kampfgruppen sind leider vom Platz her beschränkt.
                        Daher müssen wir um den aktiven Mitgliedern Platz zu schaffen inaktive Mitglieder entfernen.`,
					},
					{
						name: "System:",
						value: `Wir richten uns beim Aussortieren nach der Discord Aktivität.
                        Dass heißt, wir behalten discord-aktive Mitgleider und entfernen discord-inaktive Mitglieder wenn dafür die notwendigkeit besteht.`,
					},
					{
						name: "Support:",
						value: `Falls du dich als aktives Diescord-Mitglied ansiehst und denkst du wirst ungerecht behandelt dann wende dich gerne an einen Offizier auf unserem Server.
                        Du bist natürlich immmer noch gerne Willkommen auf unserem Server o7`,
					},
				],
				timestamp: Date.now(),
			});
			// send embed
			member.send({ embeds: [removeEmbed] }).catch(() => {
				const channel = member.guild.channels.cache.get(
					botconfig.uffzChannelId
				);
				channel.send(`<@${user.id}> konnte nicht benachrichtigt werden!`);
			});
			// /user/add
		} else if (interaction.options.getSubcommand() === "add") {
			// get guildmember object from user objectsetNickname
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// get mannschafterRolePointer -> 1 || 2
			const role = interaction.options.getInteger("role");
			// manage roles
			switch (role) {
				case 1: {
					member.roles.add(botconfig.mannschafter1RoleId);
					member.roles.remove(botconfig.mannschafter2RoleId);
					member.roles.remove(botconfig.mannschafter3RoleId);
					interaction.reply({
						content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter1RoleId}>!`,
						ephemeral: true,
					});

					break;
				}

				case 2: {
					member.roles.add(botconfig.mannschafter2RoleId);
					member.roles.remove(botconfig.mannschafter1RoleId);
					member.roles.remove(botconfig.mannschafter3RoleId);
					member.roles.remove(botconfig.cwRoleId);
					interaction.reply({
						content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter2RoleId}>!`,
						ephemeral: true,
					});

					break;
				}

				case 3: {
					member.roles.add(botconfig.mannschafter3RoleId);
					member.roles.remove(botconfig.mannschafter1RoleId);
					member.roles.remove(botconfig.mannschafter2RoleId);
					member.roles.remove(botconfig.cwRoleId);
					interaction.reply({
						content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter3RoleId}>!`,
						ephemeral: true,
					});

					break;
				}

				default: {
					interaction.reply({
						content: "Somthing went wrong!",
						ephemeral: true,
					});
				}
			}

			const nickname = interaction.options.getString("nickname");
			if (nickname === "reset") {
				member.setNickname(null);
			} else if (nickname !== null) {
				member.setNickname(nickname);
			}
		}
	}

	if (interaction.options.getSubcommandGroup() === "clanwar") {
		// check for required permission
		const check = await checkPerm(interaction, "MOVE_MEMBERS");
		if (!check) return;
		// /user/remove
		if (interaction.options.getSubcommand() === "remove") {
			// get guildmember objecct from user object
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// manage role
			member.roles.remove(botconfig.cwRoleId);
			// send feedback
			interaction.reply({
				content: `<@${user.id}> ist jetzt kein clanwar Teammitglied mehr!`,
				ephemeral: true,
			});
			// /user/add
		} else if (interaction.options.getSubcommand() === "add") {
			// get guildmember object from user objectsetNickname
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// manage roles
			member.roles.add(botconfig.cwRoleId);
			interaction.reply({
				content: `<@${user.id}> ist jetzt Clanwar-Mitglied!`,
				ephemeral: true,
			});
		}
	}
}
