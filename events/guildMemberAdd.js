const Discord = require("discord.js");

module.exports = {
	name: "guildMemberAdd",
	execute(member) {
        // TODO if-abfrage ob user dm empfangen kann

        const embed = new Discord.MessageEmbed({
			color: "2F3136",
			title: `Herzlich Willkommen auf dem Discord Server von 🍻Durst🍻`,
			description: `Bitte wende dich wenn du Zeit hast an einen Offizier, damit dir alle Berechtigungen gegeben werden.`,
			fields: [
				{ name: "✅Accepted:", value: "\u200B", inline: true },
				{ name: "❌Declined:", value: "\u200B", inline: true },
				{ name: "❔Maybe:", value: "\u200B", inline: true },
			],
			timestamp: Date.now(),
		});
        member.send(embed)
    },
};