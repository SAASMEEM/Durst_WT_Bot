const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const humanDuration = require("humanize-duration");
const mongoose = require("mongoose");
const botconfig = require("../../config.json");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`leaderboard`)
		.setDescription("View the users who spent the most time in voice channels")
		.addNumberOption((option) =>
			option.setName("page").setDescription("Select a Page")
		),

	async execute(interaction) {
		Data.find({
			lb: "all",
		})
			.sort([["time", "descending"]])
			.exec((error, result) => {
				if (error) console.log(error);
				const lastPage = Math.ceil(result.length / 10);

				const leaderboardEmbed = new Discord.MessageEmbed()
					.setTitle(`Top Users`)
					.setDescription(`All time Leaderboard`);
				const pageOption = interaction.options.getNumber("page");
				let page = Number.parseInt(pageOption, 10);
				if (!page) page = 1;
				if (page !== Math.floor(page)) page = 1;
				const end = page * 10;
				const start = page * 10 - 10;

				/*
            const forwardButton = new Discord.MessageButton()
                .setCustomId('left')
                .setEmoji('◀️')
                .setStyle('PRIMARY');
            const backButton = new Discord.MessageButton()
                .setCustomId('right')
                .setEmoji('▶️')
                .setStyle('PRIMARY');
                */

				if (result.length === 0) {
					leaderboardEmbed.addFields({
						name: "Error",
						value: "No pages found",
					});
					/*
                forwardButton.setDisabled(true);
                backButton.setDisabled(true);
                */
				} else if (result.length <= start) {
					leaderboardEmbed.addFields({
						name: "Error",
						value: "Page not found!",
					});
					/*
                forwardButton.setDisabled(true);
                backButton.setDisabled(true);
                */
				} else if (result.length <= end) {
					leaderboardEmbed.setFooter({ text: `page ${page} of ${lastPage}` });
					for (let i = start; i < result.length; i++) {
						leaderboardEmbed.addField(
							`${i + 1}. \`${humanDuration(result[i].time, {
								unit: ["h", "m"],
								round: true,
							})}\``,
							`${result[i].nickname} \(${result[i].name}\)`
						);
					}
				} else {
					leaderboardEmbed.setFooter({ text: `page ${page} of ${lastPage}` });
					for (let i = start; i < end; i++) {
						leaderboardEmbed.addField(
							`${i + 1}. \`${humanDuration(result[i].time, {
								unit: ["h", "m"],
								round: true,
							})}\``,
							`${result[i].nickname} \(${result[i].name}\)`
						);
					}
				}

				interaction.reply({
					embeds: [
						leaderboardEmbed,
					] /* components: [forwardButton, backButton]*/,
				});
			});
	},
};
