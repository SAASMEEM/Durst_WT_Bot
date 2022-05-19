const mongoose = require("mongoose");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../../config.json");
const { checkPerms } = require("../../import_folders/functions");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Status = require("../../models/dbstatus");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`status`)
		.setDescription("Set the Bot Status")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Insert the status name")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Insert the status type")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("state")
				.setDescription("Insert the state")
				.setRequired(true)
		),

	async execute(interaction) {
		var check = await checkPerms(
			interaction,
			botconfig.adminId,
			null /*'772094019748233218'*/,
			null
		);
		if (!check) return;

		const Name = interaction.options.getString("name");
		const Type = interaction.options.getString("type");
		const State = interaction.options.getString("state");
		if (!Type === "PLAYING" || !Type === "LISTENING" || !Type === "COMPETING")
			return interaction.reply({
				content: `You entered a false Type! Please use [PLAYING/LISTENING]`,
				ephemeral: true,
			});
		if (
			!State === "idle" ||
			!State === "online" ||
			!State === "dnd" ||
			!State === "invisible"
		)
			return interaction.reply({
				content: `You entered a false State! Please use [idle/online/dnd]`,
				ephemeral: true,
			});

		Status.findOne(
			{
				search: true,
			},
			(err, status) => {
				if (err) console.log(err);
				if (!status) {
					const newData = new Data({
						name: Name,
						type: Type,
						status: State,
						search: true,
					});
					newData.save().catch((err) => console.log(err));
				} else {
					status.name = Name;
					status.type = Type;
					status.state = State;
					status.save().catch((err) => console.log(err));
				}
				interaction.reply({
					content: `Name changed to "${Name}"\nType changed to "${Type}"\nState changed to "${State}`,
					ephemeral: true,
				});
			}
		);
	},
};
