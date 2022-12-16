const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json');
const { checkPerms } = require("../../import_folders/functions.js");
const e = require("express");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("squadron")
        .setDescription("manage the squadron")
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName('user')
                .setDescription('manage the users')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('Remove a user from the squadron')
                        .addUserOption(option =>
                            option
                                .setName('target')
                                .setDescription('The user')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('Add a user to the squadron')
                        .addUserOption(option =>
                            option
                                .setName('target')
                                .setDescription('The user')
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('role')
                                .setDescription('Choose the mannschafter-role the user should get added')
                                .setRequired(true)
                                .setChoices(
                                    { name: 'Mannschafter (Main)', value: 1 },
                                    { name: 'Mannschafter (zweit)', value: 2 }
                                )
                        )
                        .addStringOption(option =>
                            option
                                .setName('nickname')
                                .setDescription('Add a Nickname to the user. Fill in \"reset\" to remove the nickname')
                                .setRequired(false)
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
        if (!check) return;
        // /user
        if (interaction.options.getSubcommandGroup() === "user") {
            // /user/remove
            if (interaction.options.getSubcommand() === "remove") {
                // get guildmember objecct from user object
                const user = interaction.options.getUser("target")
                const member = await interaction.guild.members.fetch(user).then()
                // manage roles
                member.roles.remove(botconfig.mannschafter1RoleId)
                member.roles.remove(botconfig.mannschafter2RoleId)
                member.roles.remove(botconfig.cwRoleId)
                // send feedback
                interaction.reply({
                    content: `<@${user.id}> ist jetzt kein Mannschafter mehr!`,
                    ephemeral: true
                })
                // create embed for user DM
                const removeEmbed = new Discord.MessageEmbed({
                    color: "2F3136",
                    thumbnail: {
                        url: `https://cdn.discordapp.com/icons/515253143580442660/d83147d1c4f5ebd03c71793a61ec0b5e.webp?size=96`
                    },
                    title: `Nachricht von 🍻Durst🍻`,
                    description: `[discord server](https://discord.gg/ecZR7WxMPt)`,
                    fields: [
                        { name: "Nachricht:", value: `Du wurdest aus der Ingame Kampfgruppe entfernt!`},
                        { name: "Warum:", value: `Unsere Ingame Kampfgruppen sind leider vom Platz her beschränkt.
                        Daher müssen wir um den aktiven Mitgliedern Platz zu schaffen inaktive Mitglieder entfernen.`},
                        {
                            name: "System:", value: `Wir richten uns beim Aussortieren nach der Discord Aktivität.
                        Dass heißt, wir behalten discord-aktive Mitgleider und entfernen discord-inaktive Mitglieder wenn dafür die notwendigkeit besteht.`},
                        {
                            name: "Support:", value: `Falls du dich als aktives Diescord-Mitglied ansiehst und denkst du wirst ungerecht behandelt dann wende dich gerne an einen Offizier auf unserem Server.
                        Du bist natürlich immmer noch gerne Willkommen auf unserem Server o7`},
                    ],
                    timestamp: Date.now(),
                });
                // send embed
                member.send({ embeds: [removeEmbed] }).catch(e => {
                    const channel = member.guild.channels.cache.get(botconfig.uffzChannelId)
                    channel.send(`<@${user.id}> konnte keine Direktnacht empfangen!`)
                    return
                })
                // /user/add
            } else if (interaction.options.getSubcommand() === "add") {
                // get guildmember object from user objectsetNickname
                const user = interaction.options.getUser("target")
                const member = await interaction.guild.members.fetch(user).then()
                // get mannschafterRolePointer -> 1 || 2
                const role = interaction.options.getInteger("role")
                // manage roles
                if (role == 1) {
                    member.roles.add(botconfig.mannschafter1RoleId)
                    member.roles.remove(botconfig.mannschafter2RoleId)
                    interaction.reply({
                        content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter1RoleId}>!`,
                        ephemeral: true
                    })
                } else if (role == 2) {
                    member.roles.add(botconfig.mannschafter2RoleId)
                    member.roles.remove(botconfig.mannschafter1RoleId)
                    member.roles .remove(botconfig.cwRoleId)
                    interaction.reply({
                        content: `<@${user.id}> ist jetzt <@&${botconfig.mannschafter2RoleId}>!`,
                        ephemeral: true
                    })
                }
                const nickname = interaction.options.getString("nickname")
                if (nickname == "reset") {
                    member.setNickname(null)
                } else if (nickname != null) {
                    member.setNickname(nickname)
                }
            }
        }

    },
};