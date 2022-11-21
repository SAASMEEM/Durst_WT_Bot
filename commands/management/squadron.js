const Discord = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const botconfig = require('../../config.json');
const { checkPerms } = require("../../import_folders/functions.js");

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
                                    { name: 'Mannschafter (Main)', value: 1},
                                    { name: 'Mannschafter (zweit)', value: 2}
                                )
                                
                        )
                )
        ),
    async execute(interaction, guild) {
        const check = await checkPerms(
            interaction,
            null,
            botconfig.uffzRoleId,
            null
        );
        if (!check) return;
        if (interaction.options.getSubcommandGroup() === "user") {
            if (interaction.options.getSubcommand() === "remove") {
                const user = interaction.options.getUser("target")
                const member = await interaction.guild.members.fetch(user).then()
                member.roles.remove(botconfig.mannschafter1RoleId)
                member.roles.remove(botconfig.mannschafter2RoleId)
                member.roles.remove(botconfig.cwRoleId)
                member.roles.add(botconfig.freundeRoleId)
                interaction.reply({
                    content: `<@${user.id}> ist jetzt kein Mannschafter mehr!`,
                    ephemeral: true
                })
                const removeEmbed = new Discord.MessageEmbed({
                    color: "2F3136",
                    thumbnail: {
                        url: `https://cdn.discordapp.com/icons/515253143580442660/d83147d1c4f5ebd03c71793a61ec0b5e.webp?size=96`
                    },
                    title: `Nachricht von 🍻Durst🍻`,
                    description: `[discord server](https://discord.gg/ecZR7WxMPt)`,
                    fields: [
                        { name: "Nachricht:", value: `Du wurdest aus der Ingame kampfgruppe entfernt!` },
                        {
                            name: "Warum:", value: `Unsere Ingame Kampfgruppen sind leider vom Platz her beschränkt.
                        Daher müssen wir um den aktiven Mitgliedern Platz zu schaffen inaktive Mitglieder entfernen.`},
                        {
                            name: "System:", value: `Wir richten uns beim Aussortieren nach der Discord Aktivität.
                        Dass heißt, wir behalten discord-aktive Mitgleider und entfernen discord-inaktive Mitglieder wenn dafür die notwendigkeit besteht.`},
                        {
                            name: "Support:", value: `Falls du dich als aktives Diescord-Mitglied ansiehst und denkst du wirst ungerecht behandelt dann wende dich gerne an einen Offizier auf unserem Server.
                        Du bist natürlich immmer noch gerne Willkommen mit der Freundes-Rolle auf unserem Server o7`},
                    ],
                    timestamp: Date.now(),
                });
                member.send({ embeds: [removeEmbed] }).catch(e => {
                    return
                })
            } else if (interaction.options.getSubcommand() === "add") {
                const role = interaction.options.getInteger("role")
                const user = interaction.options.getUser("target")
                const member = await interaction.guild.members.fetch(user).then()
                
                

                //member.roles.remove(botconfig.freundeRoleId)
            }
        }

    },
};