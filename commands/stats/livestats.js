const fs = require("node:fs");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DOMParser } = require("xmldom");
const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const { checkPerm } = require("../../import_folders/functions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("livestats")
		.setDescription("Creates a 'squadronstats' box that gets daily updates.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("name")
				.setDescription(
					"Creates a 'squadronstats' box that receives daily updates based on the squad name."
				)
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("name of the squad")
						.setRequired(true)
				)
		)

		.addSubcommand((subcommand) =>
			subcommand
				.setName("url")
				.setDescription(
					"Creates a 'squadronstats' box that receives daily updates based on the squad url."
				)
				.addStringOption((option) =>
					option
						.setName("url")
						.setDescription("url of the squad")
						.setRequired(true)
				)
		),

	async execute(client, interaction) {
		const check = await checkPerm(interaction, "ADMINISTRATOR");
		if (!check) return;
		checker = false;
		const channelid = interaction.channel.id;
		const channel = client.channels.cache.get(channelid);
		url = "";
		interaction.reply("Livestatbox wird erstellt");
		if (interaction.options.getSubcommand() === "url") {
			url = interaction.options.getString("url");
			if (isValidUrl(url)) {
				//damit wird überprüft ob die URL passt
				//respond = "Die Kampgruppenaktivität ist aktuell " +await getstatact(url) + "\nDie Anzahl der Mitglieder ist: " + await getstatcount(url);
				if ((await squadcheck(url)) == true) {
					const title = (await getsquadname(url)) + " ";
					console.log(title);
					const statact = (await getstatact(url)) + " ";
					console.log(statact);
					const statcount = (await getstatcount(url)) + " ";
					console.log(statcount);

					const squadstatembed = new Discord.MessageEmbed()
						.setColor("0x0099FF")
						.setTitle(title)
						.setURL(url)
						.addFields(
							{ name: "Kampfgruppenaktivität", value: statact, inline: true },
							{ name: "Spielerzahl", value: statcount, inline: true }
						)
						.setTimestamp();

					respond = { embeds: [squadstatembed] };
					checker = true;
				} else {
					respond = "Die Kampfgruppe existiert nicht!";
				}
			} else {
				respond = "Die URL ist ungültig!";
			}
		} else if (interaction.options.getSubcommand() === "name") {
			const name = interaction.options.getString("name");
			url =
				"https://warthunder.com/de/community/claninfo/" +
				name.replace(/ /g, "%20");

			if ((await squadcheck(url)) == true) {
				console.log(url);
				const title = (await getsquadname(url)) + " ";
				console.log(title);
				const statact = (await getstatact(url)) + " ";
				console.log(statact);
				const statcount = (await getstatcount(url)) + " ";
				console.log(statcount);

				const squadstatembed = new Discord.MessageEmbed()
					.setColor("0x0099FF")
					.setTitle(title)
					.setURL(url)
					.addFields(
						{ name: "Kampfgruppenaktivität", value: statact, inline: true },
						{ name: "Spielerzahl", value: statcount, inline: true }
					)
					.setTimestamp();
				respond = { embeds: [squadstatembed] };
				checker = true;
			} else {
				respond = "Die Kampfgruppe existiert nicht!";
			}
		}

		const response = await channel.send(respond);
		if (checker == true) {
			fs.access("idlist.json", fs.constants.F_OK, (error) => {
				if (error) {
					const idlist = [];
					idlist[0] = [];
					idlist[0][0] = response;
					idlist[0][1] = url;
					const stringlist = JSON.stringify(idlist);
					fs.writeFile("idlist.json", stringlist, "utf8", function (error_) {
						if (error_) {
							console.log("Error occurred while writing JSON file:", error_);
							return;
						}

						console.log("JSON file has been saved.");
					});
				} else {
					console.log("File exists");
					fs.readFile("idlist.json", "utf8", function (error_, jsonContent) {
						if (error_) {
							console.log("Error occurred while reading JSON file:", error_);
							return;
						}

						let idlist = [];
						idlist = JSON.parse(jsonContent);
						console.log(idlist.length);
						idlength = idlist.length;
						idlist[idlist.length] = [];
						idlist[idlength][0] = response;
						idlist[idlength][1] = url;
						const stringlist = JSON.stringify(idlist);
						fs.writeFile("idlist.json", stringlist, "utf8", function (error_) {
							if (error_) {
								console.log("Error occurred while writing JSON file:", error_);
								return;
							}

							console.log("JSON file has been saved.");
						});
					});
				}
			});
		} else {
		}
	},
};

function isValidUrl(url) {
	//überprüft ob die URl passt
	const regex = "https://warthunder.com/de/community/claninfo/";
	return url.startsWith(regex);
}

async function getsquadname(url) {
	const html = await geturldoc(url);
	const dom = new JSDOM(html);
	const element = dom.window.document.querySelector(
		"#squadronsInfoRoot > div.squadrons-info__content-wrapper > div.squadrons-info__title"
	);
	const squadname = element.textContent.trim().toString() + " ";
	return squadname;
}

async function getstatact(url) {
	//ließt aus der html objekt den Wert eines Elements aus. In dem Fall das Element was die Aktivität der Kampfgruppe anzeitg.
	const html = await geturldoc(url);
	const dom = new JSDOM(html); //hier wird das html objekt aus dem String vom Quelltext der Seite erstellt
	const element = dom.window.document.querySelector(
		"#bodyRoot > div.content > div:nth-child(2) > div:nth-child(3) > div > section > div.squadrons-profile__header-wrapper > div.squadrons-profile__header-aside.squadrons-counter.js-change-tabs > div.squadrons-counter__count-wrapper > div:nth-child(2) > div.squadrons-counter__value"
	); //hier wird das Element ausgelesen
	const iact = Number.parseInt(element.textContent.trim()); //hier wird der Text Content des Elements ausgelesen und mit trim alle Leerzeichen entfernt und danach in ein Intwert umgewandelt
	return iact;
}

async function getstatcount(url) {
	//ließt aus der html objekt den Wert eines Elements aus. In dem Fall das Element was die Anzahl der Mitglieder zeigt.
	try {
		const html = await geturldoc(url);
		const doc = new JSDOM(html); //hier wird das html objekt aus dem String vom Quelltext der Seite erstellt
		const count1 = doc.window.document.querySelector(
			"#squadronsInfoRoot > div.squadrons-info__content-wrapper > div:nth-child(2)"
		); //hier wird das Element ausgelesen
		let temporary = count1.textContent;
		temporary = temporary.replace(/[A-z]/g, ""); // ersetzen der Buchstaben durch nichts aka. Buchstaben entfernen
		temporary = temporary.replace(/ /g, ""); //Leerzeichen entfernen
		temporary = temporary.replace(/:/g, ""); //Doppelpunkt entfernen
		const icount1 = Number.parseInt(temporary); //den Rest des String in einen Intwert übersetzen
		return icount1;
	} catch (error) {
		console.error("Error:", error);
	}
}

async function geturldoc(url) {
	//holt sich den Quelltext der Webseite
	const response = await fetch(url);
	const html = await response.text();
	return html;
}

async function squadcheck(url) {
	//überprüft ob die Kampfgruppe exisitiert
	const response = await fetch(url);
	const url2 = response.url;
	check = url2 != "https://warthunder.com/de/community/clansleaderboard";
	return check;
}
