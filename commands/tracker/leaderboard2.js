const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require("mongoose");
const botconfig = require("../../config.json");
const Duration = require('humanize-duration');

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require("../../models/data.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`leaderboard2`)
        .setDescription('View the users who spent the most time in voice channels this week')
        .addNumberOption(option => option.setName('page').setDescription('Select a Page')),

    async execute(interaction) {
        Data.find({
            lb: "all"
        }).sort([
            ['timeweekly', 'descending']
        ]).exec((err, res) => {
            if (err) console.log(err);
            var page = Math.ceil(res.length / 10);

            let lbembed = new Discord.MessageEmbed()
                .setTitle(`Top Users`)
                .setDescription(`Weekly Leaderboard \`Reset: Sunday 3AM UTC\``);
            const Page = interaction.options.getNumber('page')
            let pg = parseInt(Page);
            if (pg != Math.floor(pg)) pg = 1;
            if (!pg) pg = 1;
            let end = pg * 10
            let start = (pg * 10) - 10;


            if (res.length === 0) {
                lbembed.addFields({
                    name: "Error", value: "No pages found"
                });

            } else if (res.length <= start) {
                lbembed.addFields({
                    name: "Error", value: "Page not found!"
                });

            } else if (res.length <= end) {
                lbembed.setFooter({ text: `page ${pg} of ${page}` });
                for (i = start; i < res.length; i++) {
                    lbembed.addField(`${i + 1}. \`${Duration(res[i].timeweekly, { unit: ['h', 'm'], round: true })}\``, `${res[i].nickname} \(${res[i].name}\)`)
                }
            } else {
                lbembed.setFooter({ text: `page ${pg} of ${page}` });
                for (i = start; i < end; i++) {
                    lbembed.addField(`${i + 1}. \`${Duration(res[i].timeweekly, { unit: ['h', 'm'], round: true })}\``, `${res[i].nickname} \(${res[i].name}\)`)
                }
            }
            interaction.reply({ embeds: [lbembed] })
        })
    },
};