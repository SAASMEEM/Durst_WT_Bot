const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DOMParser } = require('xmldom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("squadronstats")
        .setDescription("creates a squadronstats box")
        .addStringOption((option) =>
            option.setName("url").setDescription("url of the squad")
        ),
    async execute(client, interaction) {
        const url = interaction.options.getString("url")
        if (isValidUrl(url)) {  //damit wird überprüft ob die URL passt
          respond = "Die Kampgruppenaktivität ist aktuell " +await getstatact(url) + "\nDie Anzahl der Mitglieder ist: " + await getstatcount(url);
          const squadstatembed = new Discord.MessageEmbed()
              .setcolor("0x0099FF")
              .setTitle(await getsquadname)
              .setURl(url)
              .addFields(
                { name: 'Kampfgruppenaktivität', value: await getstatact, inline: true },
		            { name: 'Spielerzahl', value: await getstatcount, inline: true },
              )
              .setTimestamp()
          
          channel.send({ embeds: [squadstatembed] });       
          
        } else {
          respond ="Die URL ist ungültig!";
        }
        
        await interaction.reply(respond);
    },
};


function isValidUrl(url) {  //überprüft ob die URl passt
  const regex = "https://warthunder.com/de/community/claninfo/";
  return url.startsWith(regex);
}

async function getsquadname(url){
  const html = await geturldoc
  const dom = new JSDOM(html);
  const element = dom.window.document.querySelector("#squadronsInfoRoot > div.squadrons-info__content-wrapper > div.squadrons-info__title")
  return element;
}


async function getstatact(url) { //ließt aus der html objekt den Wert eines Elements aus. In dem Fall das Element was die Aktivität der Kampfgruppe anzeitg.
  const html = await geturldoc(url);
  const dom = new JSDOM(html);  //hier wird das html objekt aus dem String vom Quelltext der Seite erstellt
  const element = dom.window.document.querySelector("#bodyRoot > div.content > div:nth-child(2) > div:nth-child(3) > div > section > div.squadrons-profile__header-wrapper > div.squadrons-profile__header-aside.squadrons-counter.js-change-tabs > div.squadrons-counter__count-wrapper > div:nth-child(2) > div.squadrons-counter__value");//hier wird das Element ausgelesen
  const iact = parseInt(element.textContent.trim()); //hier wird der Text Content des Elements ausgelesen und mit trim alle Leerzeichen entfernt und danach in ein Intwert umgewandelt
  return iact;
}

async function getstatcount(url) { //ließt aus der html objekt den Wert eines Elements aus. In dem Fall das Element was die Anzahl der Mitglieder zeigt.
  try {
    const html = await geturldoc(url);
    const doc = new JSDOM(html); //hier wird das html objekt aus dem String vom Quelltext der Seite erstellt
     const count1 = doc.window.document.querySelector("#squadronsInfoRoot > div.squadrons-info__content-wrapper > div:nth-child(2)"); //hier wird das Element ausgelesen
     let temp = count1.textContent; 
     temp = temp.replace(/[A-z]/g, "");// ersetzen der Buchstaben durch nichts aka. Buchstaben entfernen
     temp = temp.replace(/ /g, ""); //Leerzeichen entfernen
     temp = temp.replace(/:/g, ""); //Doppelpunkt entfernen
     const icount1 = parseInt(temp); //den Rest des String in einen Intwert übersetzen
     return icount1;
  } catch (error) {
     console.error('Error:', error);
  }
}

async function geturldoc(url) { //holt sich den Quelltext der Webseite
  const response = await fetch(url);
  const html = await response.text();
  return html;
}