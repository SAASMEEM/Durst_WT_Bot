const Discord = require("discord.js");
const mongoose = require("mongoose");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botconfig = require("../../config.json");
const { checkPerms } = require('../../import_folders/functions')

const Data = require("../../models/data.js");

/** @type {{data: import("@discordjs/builders").SlashCommandBuilder, execute: (interaction: import("discord.js").MessageComponentInteraction) => Promise<void>}} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`clanwar`)
        .setDescription("Call a clanwar")
        .addStringOption((option) =>
            option
                .setName("battlerank")
                .setDescription("Insert the battle rank")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option
                .setName("hour")
                .setDescription("Specify the starting time")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option
                .setName("minute")
                .setDescription("Specify the starting time")
                .setRequired(true),
        ),

    async execute(interaction) {
        var check = await checkPerms(interaction, null /*botconfig.adminId*/, '772094019748233218', null)
        if (!check) return

        const br = interaction.options.getString("battlerank");
        const inserthour = interaction.options.getInteger("hour");
        const insertminute = interaction.options.getInteger("minute");
        const d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        const date = new Date(year, month, day, hour, minute, second)
        const dateseconds = date.getTime() / 1000;
        const start = new Date(year, month, day, inserthour, insertminute, 00)
        const startseconds = start.getTime() / 1000;
        const time = startseconds * 1000 - dateseconds * 1000;

        const tableEmbed = new Discord.MessageEmbed({
            color: '880099',
            title: `Clanwar (${br})`,
            description: `?????? <t:${startseconds}:R>\n[Fahrzeuge](https://wt.md5lukas.de/vehicles)\n[Checkliste](https://shorturl.at/byA07)`,
            fields: [
                { name: '???Accepted:', value: '\u200B', inline: true },
                { name: '???Declined:', value: '\u200B', inline: true },
                { name: '???Maybe:', value: '\u200B', inline: true },
            ],
            timestamp: Date.now(),
        });

        await interaction.deferReply();
        await interaction.followUp({ content: `CW um ${inserthour}:${insertminute} Uhr! Tragt euch ein!` });


        const Reactions = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setEmoji("???")
                .setCustomId("Yes")
                .setStyle("SUCCESS"),
            new Discord.MessageButton()
                .setEmoji("???")
                .setCustomId("Cancel")
                .setStyle("DANGER"),
            new Discord.MessageButton()
                .setEmoji("???")
                .setCustomId("Maybe")
                .setStyle("SECONDARY"),
        );

        const message = await interaction.channel.send({
            embeds: [tableEmbed],
            components: [Reactions],
            fetchReply: true,
        });

        const cwRoleId = '872529382034522173';
        const guild = interaction.guild;
        var cwrole = guild.roles.cache.get(cwRoleId)
        setTimeout(() => {
            message.edit({ components: [] })
            interaction.channel.send(`<@&${cwRoleId}> CW!`)
            setTimeout(() => {
                cwrole.members.forEach(member => {
                    member.roles.remove(cwRoleId);
                })
            }, 5000)
        }, time)

        const buttonCollector =
            interaction.channel.createMessageComponentCollector({
                filter: (m) =>
                    m.customId === "Yes" ||
                    m.customId === "Cancel" ||
                    m.customId === "Maybe",
                time,
            });

        /** @type {Map<string,"+"|"-"|"~">} */
        const tableMap = new Map();

        buttonCollector.on("collect", (buttonInteraction) => {
            switch (buttonInteraction.customId) {
                case "Yes":
                    if (tableMap.get(buttonInteraction.user.id) === "+") {
                        buttonInteraction.reply({
                            content: `You already accepted this clanwar!`,
                            ephemeral: true,
                        });
                        return;
                    }
                    tableMap.set(buttonInteraction.user.id, "+");
                    buttonInteraction.member.roles.add(cwRoleId)
                    buttonInteraction.reply({
                        content: `You accepted the clanwar.`,
                        ephemeral: true,
                    });
                    break;

                case "Cancel":
                    if (tableMap.get(buttonInteraction.user.id) === "-") {
                        buttonInteraction.reply({
                            content: `You already declined this clanwar!`,
                            ephemeral: true,
                        });
                        return;
                    }
                    tableMap.set(buttonInteraction.user.id, "-");
                    buttonInteraction.member.roles.remove(cwRoleId)
                    buttonInteraction.reply({
                        content: `You declined the clanwar.`,
                        ephemeral: true,
                    });
                    break;

                case "Maybe":
                    if (tableMap.get(buttonInteraction.user.id) === "~") {
                        buttonInteraction.reply({
                            content: `You already enlisted as a possible clanwar participant!`,
                            ephemeral: true,
                        });
                        return;
                    }
                    tableMap.set(buttonInteraction.user.id, "~");
                    buttonInteraction.member.roles.remove(cwRoleId)
                    buttonInteraction.reply({
                        content: `You enlisted as a possible clanwar participant.`,
                        ephemeral: true,
                    });
                    break;

                default:
                    console.log("Something Broke");
                    buttonInteraction.reply({
                        content: "Something Broke",
                        ephemeral: true,
                    });
                    break;
            }

            updateEmbed(message, tableMap);
        });
    },
};

/**
 *
 * @param {import("discord.js").Message<boolean>} message
 * @param {Map<string,"+"|"-"|"~">} map
 */
function updateEmbed(message, map) {
    message.embeds[0].fields = getFields(message, map);
    message.edit({
        embeds: message.embeds,
    });
}

/**
 *
 * @param {import("discord.js").Message<boolean>} message
 * @param {Map<string,"+"|"-"|"~">} map
 */
function getFields(message, map) {
    /** @type {Map<string,"+"|"-"|"~">} */
    const keyMap = new Map([
        ["???Accepted:", "+"],
        ["???Declined:", "-"],
        ["???Maybe:", "~"],
    ]);

    return message.embeds[0].fields.map((old) => {
        const key = keyMap.get(old.name);
        if (!key) {
            console.error("Something has gone terribly wrong here!");
            return undefined;
        }

        const ids = Array.from(map)
            .filter((v) => v[1] === key)
            .map((v) => v[0]);

        return {
            name: old.name,
            value: `\u200B${ids.map((id) => `<@${id}>\n `).join("")}`,
            inline: true,
        };
    });
}