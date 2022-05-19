const mongoose = require("mongoose");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const botconfig = require("../../config.json");
const { checkPerms } = require("../../import_folders/functions.js");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`block`)
		.setDescription(
			"Blocks a user from the leaderboard and deletes their channel-time"
		)
		.addUserOption((option) =>
			option.setName("target").setDescription("Select a User").setRequired(true)
		),

	async execute(interaction) {
		const check = await checkPerms(
			interaction,
			null,
			"772094019748233218",
			null
		);
		if (!check) return;

		const User = interaction.options.getUser("target");
		if (!User) return interaction.reply("Couldn't find user");

		const confirmation = new MessageActionRow().addComponents(
			new MessageButton().setEmoji("✅").setCustomId("Yes").setStyle("SUCCESS"),
			new MessageButton()
				.setEmoji("❌")
				.setCustomId("Cancel")
				.setStyle("DANGER")
		);

		const Blocked = await Data.exists({ blocked: true });
		//console.log(Blocked)

		if (Blocked)
			return interaction.reply(`You cannot block an already blocked user.`);
		await interaction.reply({
			content: `React with ✅ to confirm the block of ${User.tag}`,
			components: [confirmation],
			fetchReply: true,
		});

		const filter = (i) => i.customId === "Yes" || "Cancel";

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			time: 15 * 1000,
		});
		collector.on("collect", async (i) => {
			if (i.customId === "Yes") {
				Data.findOne(
					{
						userID: User.id,
					},
					(error, data) => {
						if (error) console.log(error);
						data.time = 0;
						data.timeweekly = 0;
						data.lb = "none";
						data.blocked = true;
						data.save().catch((error) => console.log(error));
						i.update({
							content: `${User.username} was blocked!`,
							components: [],
						});
					}
				);
			} else {
				i.update({ content: `Request was cancelled!`, components: [] });
			}
		});
	},
};
