const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json');
const { checkPerms } = require("../../import_folders/functions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("squadron")
        .setDescription("manage the squadron")
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName('user')
                .setDescription('manage the users')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('Remove a user from the squadron')
                        .addUserOption(option =>
                            option
                                .setName('target')
                                .setDescription('The user')
                                .setRequired(true)
                        )
                )
        ),
    async execute(interaction, guild) {
        const check = await checkPerms(
            interaction,
            null,
            botconfig.uffzRoleId,
            null
        );
        if (!check) return;
        if (interaction.options.getSubcommandGroup() === "user") {
            if (interaction.options.getSubcommand() === "remove") {
                const user = interaction.options.getUser("target")
                const member = await interaction.guild.members.fetch(user).then()
                member.roles.remove(botconfig.mannschafter1RoleId)
                member.roles.remove(botconfig.mannschafter2RoleId)
                member.roles.remove(botconfig.cwRoleId)
                member.roles.add(botconfig.freundeRoleId)
                interaction.reply({
                    content: `<@${user.id}> ist jetzt kein Mannschafter mehr!`,
                    ephemeral: true
                })
            }
        }

    },
};