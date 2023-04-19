const { SlashCommandBuilder } = require("@discordjs/builders");
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("squadronstats")
        .setDescription("creates a squadronstats box")
        .addStringOption((option) =>
            option.setName("url").setDescription("url of the squad")
        ),
    async execute(interaction) {
        const url = interaction.options.getString("url")
        respond = "";
        if (isValidUrl(url)) {
          respond = "Die Kampgruppenaktivität ist aktuell " +await getstatact(url) + "\nDie Anzahl der Mitglieder ist: " + await getstatcount(url);
          
          
          
        } else {
          respond ="Die URL ist ungültig!";
        }
        
        await interaction.reply(respond);
    },
};


function isValidUrl(url) {
  const regex = "https://warthunder.com/de/community/claninfo/";
  return url.startsWith(regex);
}


async function getstatact(url) {
  const html = await geturldoc(url);
  const dom = new JSDOM(html);
  const element = dom.window.document.querySelector("#bodyRoot > div.content > div:nth-child(2) > div:nth-child(3) > div > section > div.squadrons-profile__header-wrapper > div.squadrons-profile__header-aside.squadrons-counter.js-change-tabs > div.squadrons-counter__count-wrapper > div:nth-child(2) > div.squadrons-counter__value");
  const iact = parseInt(element.textContent.trim());
  return iact;
}

async function getstatcount(url) {
  try {
    const html = await geturldoc(url);
    const doc = new JSDOM(html);
     const count1 = doc.window.document.querySelector("#squadronsInfoRoot > div.squadrons-info__content-wrapper > div:nth-child(2)");
     let temp = count1.textContent;
     temp = temp.replace(/[A-z]/g, "");
     temp = temp.replace(/ /g, "");
     temp = temp.replace(/:/g, "");
     const icount1 = parseInt(temp);
     return icount1;
  } catch (error) {
     console.error('Error:', error);
  }
}

async function geturldoc(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}