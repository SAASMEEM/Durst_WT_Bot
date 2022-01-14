const mongoose = require("mongoose");
const { SlashCommandBuilder } = require('@discordjs/builders');
const botconfig = require("../../config.json");
const { Permissions } = require('discord.js');
const Discord = require('discord.js');

const Data = require("../../models/data.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`clanwar`)
        .setDescription('Call a clanwar')
        .addStringOption(option => option.setName('battlerank').setDescription('Insert the battle rank').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('Specify the starting time').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: `You don't have permissions to call a clanwar.`, ephermal: true })
        const br = interaction.options.getString('battlerank');
        const Time = interaction.options.getString('time');

        let tableEmbed = new Discord.MessageEmbed()
            .setColor('#880099')
            .setTitle('Clanwar')
            .setDescription(`Battlerank: ${br}\nTime: ${Time}`)
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                { name: '✅Accepted:', value: '\u200b', inline: true },
                { name: '❌Declined:', value: '\u200b', inline: true },
                { name: '❔Maybe:', value: '\u200b', inline: true },
            )
            .setTimestamp()

        await interaction.deferReply();
        await interaction.followUp({ content: `<@872529382034522173>` })

        const Reactions = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setEmoji('✅')
                    .setCustomId('Yes')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setEmoji('❌')
                    .setCustomId('Cancel')
                    .setStyle('DANGER'),
                new Discord.MessageButton()
                    .setEmoji('❔')
                    .setCustomId('Maybe')
                    .setStyle('SECONDARY'),
            )

        const m = await interaction.channel.send({ embeds: [tableEmbed], components: [Reactions], fetchReply: true })

        const acceptfilter = a => a.customId === 'Yes'
        const declinefilter = d => d.customId === 'Cancel'
        const questionfilter = q => q.customId === 'Maybe'

        const time = 3000000

        const accept = interaction.channel.createMessageComponentCollector({ acceptfilter, time: time });
        const decline = interaction.channel.createMessageComponentCollector({ declinefilter, time: time });
        const question = interaction.channel.createMessageComponentCollector({ questionfilter, time: time });

        //create arrays
        const acceptarray = [];
        const declinearray = [];
        const questionarray = [];



        accept.on('collect', async a => {
            if (a.customId = 'Yes') {
                console.log(`accept`)
                if (acceptarray.includes(a.user.id)) return;
                acceptarray.push(a.user.id)
                console.log(acceptarray)
                console.log(declinearray)
                console.log(questionarray)


                const embed = m.embeds[0]
                embed.fields[0] = { name: '✅Accepted:', value: `>>> ${acceptarray.join('\n ')}`, inline: true }
                if (declinearray.includes(a.user.id)) {
                    var declineindex = declinearray.indexOf(a.user.id);
                    if (declineindex !== -1) {
                        declinearray.splice(declineindex, 1)
                    }
                    const embed = m.embeds[0]
                    embed.fields[1] = { name: '❌Declined:', value: `\u200b${declinearray.join('\n ')}`, inline: true }
                }
                if (questionarray.includes(a.user.id)) {
                    var questionindex = questionarray.indexOf(a.user.id);
                    if (questionindex !== -1) {
                        questionarray.splice(questionindex, 1)
                    }
                    const embed = m.embeds[0]
                    embed.fields[2] = { name: '❔Maybe:', value: `\u200b${questionarray.join('\n ')}`, inline: true }
                }
                console.log(acceptarray)
                console.log(declinearray)
                console.log(questionarray)
                console.log('accept over')
                m.edit({ embeds: [embed] });
            }
        })

        decline.on('collect', async d => {
            if (d.customId = 'Cancel') {
                console.log('decline')
                if (declinearray.includes(d.user.id)) return;
                declinearray.push(d.user.id)
                const embed = m.embeds[0]
                embed.fields[1] = { name: '❌Declined:', value: `>>> ${declinearray.join('\n ')}`, inline: true }
                if (acceptarray.includes(d.user.id)) {
                    var acceptindex = acceptarray.indexOf(d.user.id);
                    if (acceptindex !== -1) {
                        acceptarray.splice(acceptindex, 1)
                    }
                    const embed = m.embeds[0]
                    embed.fields[1] = { name: '✅Accepted:', value: `\u200b${acceptarray.join('\n ')}`, inline: true }
                }
                if (questionarray.includes(d.user.id)) {
                    var questionindex = questionarray.indexOf(d.user.id);
                    if (questionindex !== -1) {
                        questionarray.splice(questionindex, 1)
                    }
                    const embed = m.embeds[2]
                    embed.fields[1] = { name: '❔Maybe:', value: `\u200b${questionarray.join('\n ')}`, inline: true }
                }
                console.log(acceptarray)
                console.log(declinearray)
                console.log(questionarray)
                console.log('decline over')
                m.edit({ embeds: [embed] });
            }
        })

        question.on('collect', async q => {
            if (q.customId = 'Maybe') {
                console.log('question')
                if (questionarray.includes(q.user.id)) return;
                questionarray.push(q.user.id)
                const embed = m.embeds[0]
                embed.fields[2] = { name: '❔Maybe:', value: `>>> ${questionarray.join('\n ')}`, inline: true }
                if (acceptarray.includes(q.user.id)) {
                    var acceptindex = acceptarray.indexOf(q.user.id);
                    if (acceptindex !== -1) {
                        acceptarray.splice(acceptindex, 1)
                    }
                    const embed = m.embeds[0]
                    embed.fields[1] = { name: '✅Accepted:', value: `\u200b${acceptarray.join('\n ')}`, inline: true }
                }
                if (declinearray.includes(q.user.id)) {
                    var declineindex = declinearray.indexOf(q.user.id);
                    if (declineindex !== -1) {
                        declinearray.splice(declineindex, 1)
                    }
                    const embed = m.embeds[0]
                    embed.fields[1] = { name: '❌Declined:', value: `\u200b${declinearray.join('\n ')}`, inline: true }
                }
                console.log(acceptarray)
                console.log(declinearray)
                console.log(questionarray)
                console.log('question over')
                m.edit({ embeds: [embed] });
            }
        })
    }
}