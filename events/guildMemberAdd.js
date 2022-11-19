const Discord = require("discord.js");

module.exports = {
	name: "guildMemberAdd",
	execute(member) {
		const embed = new Discord.MessageEmbed({
			color: "2F3136",
			thumbnail: {
				url: `https://cdn.discordapp.com/icons/515253143580442660/d83147d1c4f5ebd03c71793a61ec0b5e.webp?size=96`
			},
			title: `Herzlich Willkommen auf dem Discord Server von \n🍻Durst🍻`,
			description: `Wir freuen uns dich hier zu sehen o7`,
			fields: [
				{ name: "Wichtig!", value: "Bitte wende dich wenn du Zeit hast an einen Offizier, damit dir alle Berechtigungen gegeben werden."},
			],
			timestamp: Date.now(),
		});
		member.send({embeds: [embed]}).catch (e =>{
			return
		})
    },
};