const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json')
const { checkPerms } = require("../../import_folders/functions.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("manage teams")
        .addSubcommand(subcommand =>
            subcommand
                .setName('generate')
                .setDescription('Generate random teams')
                .addIntegerOption(option =>
                    option
                        .setName('teamnum')
                        .setDescription('Choose how many teams you want to create')
                        .setRequired(true)
                        .setChoices(
                            { name: '2', value: 2 },
                            { name: '3', value: 3 },
                            { name: '4', value: 4 }
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
        if (!check) return

        const teamnumber = interaction.options.getInteger("teamnum")
        const oneHour = 60 * 60 * 1000

        // declare embed
        const tableEmbed = new Discord.MessageEmbed({
            color: "880099",
            title: `Team Generator (${teamnumber} teams)`,
            description: `\u200B`,
            fields: [
                { name: "Registered:", value: "\u200B", inline: true },
            ],
            timestamp: Date.now(),
        })
        for (let team = 1; team <= teamnumber; team++) {
            tableEmbed.addFields({ name: `Team ${team}`, value: `\u200B`, inline: true })
        }

        // declare buttons
        const ReactionsRow1 = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setEmoji("✅")
                .setLabel("Join")
                .setCustomId("Join")
                .setStyle("SUCCESS"),
            new Discord.MessageButton()
                .setEmoji("⛔")
                .setLabel("Leave")
                .setCustomId("Leave")
                .setStyle("DANGER"),
        );
        const ReactionsRow2 = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setEmoji("🔀")
                .setLabel("Shuffle teams")
                .setCustomId("Shuffle")
                .setStyle("PRIMARY"),
            new Discord.MessageButton()
                .setEmoji("🔊")
                .setLabel("Move to VC")
                .setCustomId("Voice")
                .setStyle("PRIMARY"),
        );
        const ReactionsRow3 = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setEmoji("🔚")
                .setLabel("End Command")
                .setCustomId("End")
                .setStyle("SECONDARY")
        );

        // send embed with buttons
        const message = await interaction.reply({
            embeds: [tableEmbed],
            components: [ReactionsRow1, ReactionsRow2, ReactionsRow3],
            fetchReply: true,
        });

        // create map
        /** @type {Map<string,"+"|"1"|"2"|"3"|"4">} */
        const teamMap = new Map();

        // button collector
        const buttonCollector = interaction.channel.createMessageComponentCollector(
            {
                filter: (m) =>
                    m.customId === "Join" ||
                    m.customId === "Leave" ||
                    m.customId === "Shuffle" ||
                    m.customId === "Voice" ||
                    m.customId === "End",
                oneHour,
            }
        )
    },
};