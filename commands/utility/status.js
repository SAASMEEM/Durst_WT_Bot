const mongoose = require("mongoose");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../../config.json");
const { checkPerms } = require("../../import_folders/functions.js");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Status = require("../../models/dbstatus.js");

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
		const check = await checkPerms(
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
			(error, status) => {
				if (error) console.log(error);
				if (!status) {
					status = new Status({
						name: Name,
						type: Type,
						status: State,
						search: true,
					});
					status.save().catch((error) => console.log(error));
				}

				status.name = Name;
				status.type = Type;
				status.state = State;
				status.save().catch((error) => console.log(error));

				interaction.reply({
					content: `Name changed to "${Name}"\nType changed to "${Type}"\nState changed to "${State}`,
					ephemeral: true,
				});
			}
		);
	},
};
