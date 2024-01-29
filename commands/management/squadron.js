import { readFileSync } from "node:fs";
import {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionsBitField,
} from "discord.js";
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
		const check = await checkPerm(
			interaction,
			PermissionsBitField.Flags.ManageNicknames
		);
		if (!check) return;
		// /user/remove
		if (interaction.options.getSubcommand() === "remove") {
			// get guildmember objecct from user object
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// manage role
			member.roles.remove(botconfig.cwRoleId);
			member.roles.remove(botconfig.trialRoleId);
			// send feedback
			interaction.reply({
				content: `<@${user.id}> ist jetzt kein Mannschafter mehr!`,
				ephemeral: true,
			});
			// /user/add
		} else if (interaction.options.getSubcommand() === "add") {
			// get guildmember object from user objectsetNickname
			const user = interaction.options.getUser("target");
			const member = await interaction.guild.members.fetch(user).then();
			// manage roles
			member.roles.add(botconfig.cwRoleId);
			member.roles.add(botconfig.trialRoleId);
			interaction.reply({
				content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter1RoleId}>!`,
				ephemeral: true,
			});
		}

	}

	if (interaction.options.getSubcommandGroup() === "clanwar") {
		// check for required permission
		const check = await checkPerm(
			interaction,
			PermissionsBitField.Flags.MentionEveryone
		);
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
