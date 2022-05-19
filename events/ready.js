const mongoose = require("mongoose");
const processTitle = require("node-bash-title");
const botconfig = require("../config.json");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Status = require("../models/dbstatus.js");
const Data = require("../models/data.js");

module.exports = {
	name: "ready",
	execute(client) {
		processTitle("Durst-WarThunder");
		console.clear();
		console.log(`Ready! Logged in as ${client.user.tag}`);
		setInterval(() => {
			Status.findOne(
				{
					search: true,
				},
				(error, status) => {
					if (error) console.log(error);
					if (!status) {
						const newStatus = new Status({
							name: "War Thunder",
							type: "PLAYING",
							state: "idle",
							search: true,
						});
						newStatus.save().catch((error) => console.log(error));
					}

					client.user.setPresence({
						activities: [{ name: status.name, type: status.type }],
						status: status.state,
					});
				}
			);
		}, 1 * 60 * 1000);

		setInterval(() => {
			const d = new Date();
			const day = d.getUTCDay();
			const hour = d.getUTCHours();
			const minute = d.getUTCMinutes();
			const second = d.getUTCSeconds();

			if (day === 0 && hour === 3 && minute === 0 && second === 0) {
				const bulkArray = [
					{
						updateMany: {
							filter: {},
							update: { timeweekly: 0 },
						},
					},
				];
				Data.bulkWrite(bulkArray);
			}
		}, 60 * 1000);
	},
};
