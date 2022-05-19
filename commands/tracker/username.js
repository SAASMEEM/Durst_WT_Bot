const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const botconfig = require("../../config.json");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const Data = require("../../models/data.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`username`)
		.setDescription("Changes your username")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Set your new username")
				.setRequired(true)
		),

	async execute(interaction) {
		const Name = interaction.options.getString("name");
		Data.findOne(
			{
				userID: interaction.user.id,
			},
			(error, data) => {
				if (error) console.log(error);
				if (!data) {
					data = new Data({
						userID: interaction.author.id,
						nickname: Name,
						lb: "all",
						time: 0,
						blocked: false,
					});
					data.save().catch((error) => console.log(error));
				}

				data.nickname = Name;
				data.save().catch((error) => console.log(error));

				interaction.reply(`Name changed to ${Name}`);
			}
		);
	},
};
