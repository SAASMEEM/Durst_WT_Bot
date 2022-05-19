const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const duration = require("humanize-duration");
const mongoose = require("mongoose");
const botconfig = require("../../config.json");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`userinfo`)
		.setDescription("Displays the time spent in voice channels")
		.addUserOption((option) =>
			option.setName("target").setDescription("Select a User")
		),

	async execute(interaction) {
		const User = interaction.options.getUser("target") || interaction.user;
		if (!User)
			await interaction.reply({
				content: "Couldn't find user",
				ephemeral: true,
			});
		const infoEmbed = new Discord.MessageEmbed()
			.setColor("#880099")
			.setTitle(`${User.username}`)
			.setThumbnail(User.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		Data.findOne(
			{
				userID: User.id,
			},
			(error, data) => {
				if (error) console.log(error);
				if (!data) {
					infoEmbed.addFields({
						name: "This User has no profile set up!",
						value: `<@${User.id}> can create their profile by using voice-channel.`,
					});
					interaction.reply({ embeds: [infoEmbed] });
					return;
				}

				infoEmbed.addFields({ name: "Name:", value: `${data.name}` });
				infoEmbed.addFields({ name: "Nickname", value: `${data.nickname}` });
				infoEmbed.addFields({
					name: "Time:",
					value: `${duration(data.time, { unit: ["h", "m"], round: true })}`,
				});
				infoEmbed.addFields({
					name: "Weekly Time:",
					value: `${duration(data.timeweekly, {
						unit: ["h", "m"],
						round: true,
					})}`,
				});
				infoEmbed.addFields({ name: "Blocked:", value: `${data.blocked}` });
				interaction.reply({ embeds: [infoEmbed] });
			}
		);
	},
};
