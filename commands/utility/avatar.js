import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("avatar")
	.setDescription(
		"Get the avatar URL of the selected user, or your own avatar."
	)
	.addUserOption((option) => option.setName("target").setDescription("The user's avatar to show")
	);
export async function execute(client, interaction) {
	const user = interaction.options.getUser("target") || interaction.user;

	const AvatarEmbed = new MessageEmbed()
		.setColor(interaction.member.displayHexColor)
		.setTimestamp()
		.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));
	await interaction.reply({ embeds: [AvatarEmbed] });
}
