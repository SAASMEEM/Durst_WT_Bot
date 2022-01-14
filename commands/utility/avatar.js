const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkCC } = require('../../import_folders/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar URL of the selected user, or your own avatar.')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        var ccheck = await checkCC(interaction, null, null)
        if (ccheck) {
            const user = interaction.options.getUser('target') || interaction.user;

            const AvatarEmbed = new Discord.MessageEmbed()
                .setColor(interaction.member.displayHexColor)
                .setTimestamp()
                .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));
            await interaction.reply({ embeds: [AvatarEmbed] });
        }
    },
};