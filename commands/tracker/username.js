const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require("mongoose");
const botconfig = require("../../config.json");

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Data = require("../../models/data.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`username`)
        .setDescription('Changes your username')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Set your new username')
                .setRequired(true)),

    async execute(interaction) {
        const Name = interaction.options.getString('name')
        Data.findOne({
            userID: interaction.user.id
        }, (err, data) => {
            if (err) console.log(err);
            if (!data) {
                const newData = new Data({
                    userID: interaction.author.id,
                    name: Name,
                    lb: "all",
                    time: 0,
                    blocked: false,
                })
                newData.save().catch(err => console.log(err));
            } else {
                data.name = Name;
                data.save().catch(err => console.log(err));
            }
            interaction.reply(`Name changed to ${Name}`)
        })
    },
};