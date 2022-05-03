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
                .setName("time")
                .setDescription("Specify the starting time")
                .setRequired(true),
        ),

    async execute(interaction) {
        var check = await checkPerms(interaction, botconfig.adminId, null/*'772094019748233218'*/, null)
        if (!check) return

        const br = interaction.options.getString("battlerank");
        const Time = interaction.options.getInteger("time");

        const tableEmbed = new Discord.MessageEmbed({
            color: '880099',
            title: `Clanwar (${br})`,
            description: `⏲️ ${Time}\n[Fahrzeuge](https://wt.md5lukas.de/vehicles)\n[Checkliste](https://shorturl.at/byA07)`,
            fields: [
                { name: '✅Accepted:', value: '\u200B', inline: true },
                { name: '❌Declined:', value: '\u200B', inline: true },
                { name: '❔Maybe:', value: '\u200B', inline: true },
            ],
            timestamp: Date.now(),
        });

        await interaction.deferReply();
        await interaction.followUp({ content: `CW um ${Time} Uhr! Tragt euch ein!` });

        const Reactions = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setEmoji("✅")
                .setCustomId("Yes")
                .setStyle("SUCCESS"),
            new Discord.MessageButton()
                .setEmoji("❌")
                .setCustomId("Cancel")
                .setStyle("DANGER"),
            new Discord.MessageButton()
                .setEmoji("❔")
                .setCustomId("Maybe")
                .setStyle("SECONDARY"),
        );

        const message = await interaction.channel.send({
            embeds: [tableEmbed],
            components: [Reactions],
            fetchReply: true,
        });

        const time = 86400000;

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
        ["✅Accepted:", "+"],
        ["❌Declined:", "-"],
        ["❔Maybe:", "~"],
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