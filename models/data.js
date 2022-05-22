const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
	userID: String,
	name: String,
	nickname: String,
	lb: String,
	time: Number,
	timeweekly: Number,
	blocked: Boolean,
});

module.exports = mongoose.model("Data", dataSchema);
