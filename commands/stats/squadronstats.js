const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("squadronstats")
        .setDescription("creates a squadronstats box")
        .addStringOption((option) =>
            option.setName("url").setDescription("url of the squad")
        ),
    async execute(client, interaction) {
        const url = interaction.options.getString("url")
        await interaction.reply(getstatact(url) + " " + getstatcount(url));
    },
};

async function getstatact(url) {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const link = doc.querySelector("#bodyRoot > div.content > div:nth-child(2) > div:nth-child(3) > div > section > div.squadrons-profileheader-wrapper > div.squadrons-profileheader-aside.squadrons-counter.js-change-tabs > div.squadrons-countercount-wrapper > div:nth-child(2) > div.squadrons-countervalue");
    const iact = parseInt(link.textContent.trim());
    return iact;
}

async function getstatcount(url) {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const count1 = doc.querySelector("#squadronsInfoRoot > div.squadrons-info__content-wrapper > div:nth-child(2)");
    let temp = count1.textContent;
    temp = temp.replace(/[A-z]/g, "");
    temp = temp.replace(/ /g, "");
    temp = temp.replace(/:/g, "");
    const icount1 = parseInt(temp);
    return icount1;
}