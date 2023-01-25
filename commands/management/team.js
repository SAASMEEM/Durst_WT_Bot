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
        const unixTimeNow = Math.floor(Date.now() / 1000)
        const unixTimeEnd = unixTimeNow + 60 * 60

        // declare embed
        const tableEmbed = new Discord.MessageEmbed({
            color: "880099",
            title: `Team Generator (${teamnumber} teams)`,
            description: `Unvalid <t:${unixTimeEnd}:R>`,
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

        // remove buttons and send notification
        setTimeout(() => {
            teamEnd(message)
        }, 1000 * 60 * 60);

        // create arrays
        let entryArray = []
        let team1Array = []
        let team2Array = []
        let team3Array = []
        let team4Array = []

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
        buttonCollector.on("collect", async (buttonInteraction) => {
            switch (buttonInteraction.customId) {
                case "Join":
                    teamJoin(buttonInteraction, entryArray)
                    updateEmbedEntry(message, entryArray)
                    break

                case "Leave":
                    teamLeave(buttonInteraction, entryArray)
                    updateEmbedEntry(message, entryArray)
                    break

                case "Shuffle":
                    teamShuffle(buttonInteraction, teamnumber, entryArray, team1Array, team2Array, team3Array, team4Array)
                    break

                case "Voice":
                    teamVoice(buttonInteraction)
                    break

                case "End":
                    if (buttonInteraction.member.id != interaction.member.id) {
                        await buttonInteraction.reply({
                            content: `Only <@${interaction.member.id}> can end this command!`,
                            ephemeral: true,
                        })
                        return
                    }
                    teamEnd(message)
                    break

                default:
                    console.log("Unknown Button");
                    await buttonInteraction.reply({
                        content: "Unknown Button",
                        ephemeral: true,
                    });
                    break
            }
        })
    },
};

// functions
// buttons
async function teamJoin(interaction, entryArray) {
    if (entryArray.includes(interaction.user.id)) {
        await interaction.reply({
            content: `You already joined the team-generator!`,
            ephemeral: true,
        });
        return
    }
    entryArray.push(interaction.user.id)
    await interaction.reply({
        content: `You joined the team-generator.`,
        ephemeral: true,
    });
}

async function teamLeave(interaction, entryArray) {
    if (!entryArray.includes(interaction.user.id)) {
        await interaction.reply({
            content: `You already left the team-generator!`,
            ephemeral: true,
        });
        return
    }
    removeArrayItemOnce(entryArray, interaction.user.id)
    await interaction.reply({
        content: `You left the team-generator.`,
        ephemeral: true,
    });
}

async function teamShuffle(interaction, teamnumber, entryArray, team1Array, team2Array, team3Array, team4Array) {
    if (entryArray.length > teamnumber) {
        await interaction.reply({
            content: `Not enough players!.`,
            ephemeral: true,
        })
    }
}

async function teamVoice(interaction) {
    await interaction.reply({
        content: `Feature coming soon!.`,
        ephemeral: true,
    });
}

function teamEnd(message) {
    message.edit({ components: [] });
}

function updateEmbedEntry(message ,entryArray) {
    if (entryArray.length == 0) {
        message.embeds[0].fields.find(f => f.name === "Registered:").value = `\u200B`
    } else {
        message.embeds[0].fields.find(f => f.name === "Registered:").value = `\u200B<@${entryArray.join(">\n<@")}>`
    }
    message.edit({ embeds: [message.embeds[0]]})
}

function removeArrayItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }