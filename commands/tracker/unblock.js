const mongoose = require("mongoose");
const { SlashCommandBuilder } = require('@discordjs/builders');
const botconfig = require("../../config.json");
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`unblock`)
        .setDescription('Unblocks a user from the leaderboard and deletes their channel-time')
        .addUserOption(option => option.setName('target').setDescription('Select a User').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content: `You don't have permissions to unblock someone.`, ephermal: true })
        const User = interaction.options.getUser('target');
        if (!User) return interaction.reply("Couldn't find user");

        const confirmation = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji('✅')
                    .setCustomId('Yes')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setEmoji('❌')
                    .setCustomId('Cancel')
                    .setStyle('DANGER'),
            );

        const Blocked = await Data.exists({ blocked: true })
        console.log(Blocked)

        if (Blocked) return interaction.reply(`You cannot block an already blocked user.`)
        const message = await interaction.reply({ content: `React with ✅ to confirm the unblock of ${User.tag}`, components: [confirmation], fetchReply: true });

        const filter = i => i.customId === 'Yes' || 'Cancel'

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15 * 1000 })
        collector.on('collect', async i => {
            if (i.customId === 'Yes') {
                Data.findOne({
                    userID: User.id,
                }, (err, data) => {
                    if (err) console.log(err)
                    data.time = 0;
                    data.lb = "all";
                    data.blocked = false;
                    data.save().catch(err => console.log(err));
                    i.update({ content: `${User.username} was unblocked!`, components: [] })
                })
            } else {
                i.update({ content: `Request was cancelled!`, components: [] });
            }
        });
    },
};