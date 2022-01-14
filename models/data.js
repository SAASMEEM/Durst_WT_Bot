const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    userID: String,
    name: String,
    lb: String,
    time: Number,
    blocked: Boolean,
})

module.exports = mongoose.model("Data", dataSchema);
