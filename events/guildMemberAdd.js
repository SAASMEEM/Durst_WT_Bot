// no need cause of community server
/*
const Discord = require("discord.js");
const botconfig = require('../config.json');

module.exports = {
	name: "guildMemberAdd",
	execute(member) {
		const embed = new Discord.MessageEmbed({
			color: "2F3136",
			thumbnail: {
				url: `https://cdn.discordapp.com/icons/515253143580442660/d83147d1c4f5ebd03c71793a61ec0b5e.webp?size=96`
			},
			title: `Herzlich Willkommen auf dem Discord Server von \n🍻Durst🍻`,
			description: `[discord server](https://discord.gg/ecZR7WxMPt)`,
			fields: [
				{ name: "Wichtig!", value: "Bitte wende dich wenn du Zeit hast an einen Offizier, damit dir alle Berechtigungen gegeben werden."},
			],
			timestamp: Date.now(),
		});
		member.send({embeds: [embed]}).catch (e =>{
			const channel = member.guild.channels.cache.get(botconfig.uffzChannelId)
			channel.send(`<@${member.user.id}> konnte keine Direktnacht empfangen!`)
			return
		})
    },
};
*/