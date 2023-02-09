const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json')
const { checkPerms, checkPerm } = require("../../import_folders/functions.js")

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
    async execute(client, interaction) {
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
        let shuffleArray = []
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
                    break

                case "Leave":
                    teamLeave(buttonInteraction, entryArray)
                    break

                case "Shuffle":
                    if (buttonInteraction.member.id != interaction.member.id) {
                        await buttonInteraction.reply({
                            content: `Only <@${interaction.member.id}> can shuffle the teams!`,
                            ephemeral: true,
                        })
                        return
                    }
                    team1Array = []
                    team2Array = []
                    team3Array = []
                    team4Array = []
                    teamShuffle(buttonInteraction, teamnumber, entryArray, shuffleArray, team1Array, team2Array, team3Array, team4Array)
                    break

                case "Voice":
                    if (buttonInteraction.member.id != interaction.member.id) {
                        await buttonInteraction.reply({
                            content: `Only <@${interaction.member.id}> can use this command!`,
                            ephemeral: true,
                        })
                        return
                    }
                    teamVoice(client, interaction, buttonInteraction, team1Array, team2Array, team3Array, team4Array)
                    break

                case "End":
                    if (buttonInteraction.member.id != interaction.member.id) {
                        await buttonInteraction.reply({
                            content: `Only <@${interaction.member.id}> can end this command!`,
                            ephemeral: true,
                        })
                        return
                    }
                    teamEnd(message, buttonCollector)
                    break

                default:
                    console.log("Unknown Button");
                    await buttonInteraction.reply({
                        content: "Unknown Button",
                        ephemeral: true,
                    });
                    break
            }
            updateEmbed(message, teamnumber, entryArray, team1Array, team2Array, team3Array, team4Array)
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

async function teamShuffle(interaction, teamnumber, entryArray, shuffleArray, team1Array, team2Array, team3Array, team4Array) {
    if (entryArray.length < teamnumber) {
        await interaction.reply({
            content: `Not enough players!`,
            ephemeral: true,
        })
        return
    }
    // Copy array into shuffleArray
    shuffleArray = entryArray.slice()
    if (teamnumber == 2) {
        while (shuffleArray.length > 0) {
            // Generate a random index from 0 to the length of the shuffleArray
            var randomIndex = Math.floor(Math.random() * shuffleArray.length);
            // Generate a random number 0 or 1
            var randomTeam = Math.floor(Math.random() * 2);
            // Remove the element at the randomIndex from the shuffleArray
            var entry = shuffleArray.splice(randomIndex, 1)[0];
            // Add the entry to the appropriate team array
            if (randomTeam === 0) {
                team1Array.push(entry);
            } else {
                team2Array.push(entry);
            }
        }
    } else if (teamnumber == 3) {
        while (shuffleArray.length > 0) {
            // Generate a random index from 0 to the length of the shuffleArray
            var randomIndex = Math.floor(Math.random() * shuffleArray.length);
            // Generate a random number 0, 1 or 2
            var randomTeam = Math.floor(Math.random() * 3);
            // Remove the element at the randomIndex from the shuffleArray
            var entry = shuffleArray.splice(randomIndex, 1)[0];
            // Add the entry to the appropriate team array
            if (randomTeam === 0) {
                team1Array.push(entry);
            } else if (randomTeam === 1) {
                team2Array.push(entry);
            } else {
                team3Array.push(entry);
            }
        }
    } else if (teamnumber == 4) {
        while (shuffleArray.length > 0) {
            // Generate a random index from 0 to the length of the shuffleArray
            var randomIndex = Math.floor(Math.random() * shuffleArray.length);
            // Generate a random number 0, 1, 2 or 3
            var randomTeam = Math.floor(Math.random() * 4);
            // Remove the element at the randomIndex from the shuffleArray
            var entry = shuffleArray.splice(randomIndex, 1)[0];
            // Add the entry to the appropriate team array
            if (randomTeam === 0) {
                team1Array.push(entry);
            } else if (randomTeam === 1) {
                team2Array.push(entry);
            } else if (randomTeam === 2) {
                team3Array.push(entry);
            } else {
                team4Array.push(entry);
            }
        }
    } else {
        console.log("ERROR: Invalid Team Number")
    }
    await interaction.reply({
        content: `Teams shuffled`,
        ephemeral: true,
    });
}

async function teamVoice(client, interaction, buttonInteraction, team1Array, team2Array, team3Array, team4Array) {
    const guild = interaction.guild
    const category = interaction.channel.parent
    const team1VoiceChannel = await guild.channels.create('team1', {
        type: 'GUILD_VOICE',
        parent: category,
        userLimit: team1Array.length
    })
    client.on('voiceStateUpdate', (oldState, newState) => {
        const channel = oldState.channel;
        if (!channel) return;
        console.log(channel)
        if (channel.id === team1VoiceChannel.id && channel.members.size === 0) {
            channel.delete()
                .then(console.log(`Deleted voice channel ${channel.name}`))
                .catch(console.error);
        }
    });

    const movedUsers = []
    let allMoved = true
    try {
        const users = await guild.members.fetch({ user: team1Array })
        for (const user of users.values()) {
            if (user.voice.channel) {
                continue
            }
            await user.voice.setChannel(team1VoiceChannel)
            movedUsers.push(user.user.username)
        }
    } catch (error) {
        if (error.name === 'DiscordAPIError') {
            allMoved = false
        } else {
            throw error
        }
    }
    if (allMoved) {
        await buttonInteraction.reply({
            content: `Moved users: ${movedUsers.join(', ')}`,
            ephemeral: true,
        })
    } else {
        await buttonInteraction.reply({
            content: `Not all users could be moved!\nMoved users: ${movedUsers.join(', ')}`,
            ephemeral: true,
        })
    }
}

function teamEnd(message, buttonCollector) {
    message.edit({ components: [] })
    buttonCollector.stop()
}

function updateEmbed(message, teamnumber, entryArray, team1Array, team2Array, team3Array, team4Array) {
    if (entryArray.length == 0) {
        message.embeds[0].fields.find(f => f.name === "Registered:").value = `\u200B`
    } else {
        message.embeds[0].fields.find(f => f.name === "Registered:").value = `\u200B<@${entryArray.join(">\n<@")}>`
    }

    if (teamnumber >= 2) {
        if (team1Array.length == 0) {
            message.embeds[0].fields.find(f => f.name === "Team 1").value = `\u200B`
        } else {
            message.embeds[0].fields.find(f => f.name === "Team 1").value = `\u200B<@${team1Array.join(">\n<@")}>`
        }

        if (team2Array.length == 0) {
            message.embeds[0].fields.find(f => f.name === "Team 2").value = `\u200B`
        } else {
            message.embeds[0].fields.find(f => f.name === "Team 2").value = `\u200B<@${team2Array.join(">\n<@")}>`
        }
    }
    if (teamnumber >= 3) {
        if (team3Array.length == 0) {
            message.embeds[0].fields.find(f => f.name === "Team 3").value = `\u200B`
        } else {
            message.embeds[0].fields.find(f => f.name === "Team 3").value = `\u200B<@${team3Array.join(">\n<@")}>`
        }
    }
    if (teamnumber >= 4) {
        if (team4Array.length == 0) {
            message.embeds[0].fields.find(f => f.name === "Team 4").value = `\u200B`
        } else {
            message.embeds[0].fields.find(f => f.name === "Team 4").value = `\u200B<@${team4Array.join(">\n<@")}>`
        }
    }
    message.edit({ embeds: [message.embeds[0]] })
}

function removeArrayItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}