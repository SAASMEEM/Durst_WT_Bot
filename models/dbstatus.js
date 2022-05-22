const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
	name: String,
	type: String,
	state: String,
	search: Boolean,
});

module.exports = mongoose.model("Status", statusSchema);
