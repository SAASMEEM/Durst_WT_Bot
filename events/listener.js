const mongoose = require("mongoose");
const botconfig = require("../config.json");

const timestamp = new Map();

const Data = require("../models/data.js");

mongoose.connect(botconfig.mongoPass, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = {
	name: "voiceStateUpdate",
	execute(oldState, newState) {
		if (newState.channelId !== null) {
			// joined channel
			//console.log(`${newState.member} has joined a channel (ID: ${newState.channelId})`);
			timestamp.set(newState.id, Date.now());
			return;
		}

		// left channel

		const joinTime = timestamp.get(newState.id);
		let timeSpent = 0;
		if (joinTime) {
			timeSpent = Date.now() - joinTime;
			timestamp.delete(newState.id);
		}

		Data.findOne(
			{
				userID: newState.id,
			},
			(error, data) => {
				if (error) console.log(error);
				if (data) {
					data.time += timeSpent;
					data.timeweekly += timeSpent;
					data.save().catch((error) => console.log(error));
					return;
				}

				const newData = new Data({
					userID: newState.id,
					name: "<@" + newState.id + ">",
					nickname: newState.member.nickname || newState.member.user.username,
					lb: "all",
					time: timeSpent,
					timeweekly: timeSpent,
					blocked: false,
				});
				newData.save().catch((error) => console.log(error));
			}
		);
		//console.log(`${newState.member} has left a channel. ${newState.id}'s time in this channel was ${timeSpent}`);
	},
};
