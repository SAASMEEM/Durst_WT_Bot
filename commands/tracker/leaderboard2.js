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

const ITEMS_PER_PAGE = 10;

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`leaderboard2`)
		.setDescription(
			"View the users who spent the most time in voice channels this week"
		)
		.addNumberOption((option) =>
			option.setName("page").setDescription("Select a Page")
		),

	async execute(interaction) {
		Data.find({
			lb: "all",
		})
			.sort([["timeweekly", "descending"]])
			.exec((error, result) => {
				if (error) console.log(error);
				const lastPage = Math.ceil(result.length / ITEMS_PER_PAGE);

				const leaderboardEmbed = new Discord.MessageEmbed()
					.setTitle(`Top Users`)
					.setDescription(`Weekly Leaderboard \`Reset: Sunday 3AM UTC\``);
				const pageOption = interaction.options.getNumber("page");
				let page = Number.parseInt(pageOption, 10);
				if (!page) page = 1;
				if (page !== Math.floor(page)) page = 1;
				const lastIndex = page * ITEMS_PER_PAGE;

				if (result.length === 0) {
					leaderboardEmbed.addFields({
						name: "Error",
						value: "No pages found",
					});
				} else if (result.length <= lastIndex - ITEMS_PER_PAGE) {
					leaderboardEmbed.addFields({
						name: "Error",
						value: "Page not found!",
					});
				} else {
					leaderboardEmbed.setFooter({ text: `page ${page} of ${lastPage}` });
					for (
						let i = lastIndex - ITEMS_PER_PAGE;
						i < Math.min(lastIndex, result.length);
						i++
					) {
						leaderboardEmbed.addField(
							`${i + 1}. \`${humanDuration(result[i].timeweekly, {
								unit: ["h", "m"],
								round: true,
							})}\``,
							`${result[i].nickname} (${result[i].name})`
						);
					}
				}

				interaction.reply({ embeds: [leaderboardEmbed] });
			});
	},
};
