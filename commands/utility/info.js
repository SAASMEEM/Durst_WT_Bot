const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkCC } = require('../../import_folders/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('shows info about the bot'),
    async execute(interaction) {
        var ccheck = await checkCC(interaction, null, null)
        if (ccheck) {
            const ram = process.memoryUsage().heapUsed / 1024 / 1024;
            const ping = new Date() - interaction.createdTimestamp;
            let totalSeconds = (interaction.client.uptime / 1000);
            let d = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let h = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let m = Math.floor(totalSeconds / 60);
            let s = Math.floor(totalSeconds % 60);

            const InfoEmbed = new Discord.MessageEmbed()
                .setTitle('Bot Info')
                .setColor(interaction.member.displayHexColor)
                .setTimestamp()
                .addFields({ name: 'Bot Name', value: `${interaction.client.user.tag}`, inline: true }, { name: 'RAM', value: `${ram.toFixed(2)}MB`, inline: true }, { name: 'Uptime', value: `${d}d, ${h}h, ${m}m, ${s}s`, inline: true }, { name: 'Bot Latency', value: `${ping}ms`, inline: true }, { name: 'API Latency', value: `${interaction.client.ws.ping}ms`, inline: true })
            await interaction.reply({ embeds: [InfoEmbed] });
        }
    },
};