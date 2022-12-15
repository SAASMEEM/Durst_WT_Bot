const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json');
const { checkPerms } = require("../../import_folders/functions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("manage teams")
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the squadron')
                .addIntegerOption(option =>
                    option
                        .setName('role')
                        .setDescription('Choose the mannschafter-role the user should get added')
                        .setRequired(true)
                        .setChoices(
                            { name: 'Mannschafter (Main)', value: 1 },
                            { name: 'Mannschafter (zweit)', value: 2 }
                        )
                )
        ),
    async execute(interaction) {
        // check for required permission
        const check = await checkPerms(
            interaction,
            null,
            botconfig.uffzRoleId,
            null
        );
        if (!check) return;
    },
};