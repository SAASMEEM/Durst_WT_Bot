const mongoose = require("mongoose");
const { SlashCommandBuilder } = require('@discordjs/builders');
const botconfig = require("../../config.json");
const { checkPerms } = require('../../import_folders/functions')

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`test`)
        .setDescription('Test command'),

    async execute(interaction, client, guild) {
        var check = await checkPerms(interaction, botconfig.adminId, null/*'772094019748233218'*/, null)
        if (!check) return


        return interaction.reply({ content: `TEST: `, ephemeral: true })
    },
};