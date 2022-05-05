const Discord = require("discord.js");
module.exports = (client, user) => {
  client.on("message", async (message) => {
    if (message.content.match(/saas|sesam|sesambrot|sam|simon/gi)) {
      if (!message.author.bot && message.author.id != "515561998080278570") {
        const server = message.guild;
        const channel = message.channel;
        const author = message.author;
        const content = message.content;
        const link = message.url;
        const embed = new Discord.MessageEmbed()
          .setColor("#6f3798")
          .setAuthor(
            "ˢᵉˢᵃᵐʙᴏᴛ",
            "https://cdn.discordapp.com/attachments/847785221034082315/847785511770914856/PB_S_gros.png",
            "https://www.twitch.tv/saasmeem"
          )
          .setDescription(
            "**Links >** [Support Server](https://discord.gg/au6qeHnSYJ)"
          )
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/847785221034082315/855584570292043776/ping_saas.png"
          )
          .addFields(
            { name: `__Server:__`, value: `${server}` },
            { name: `__Channel:__`, value: `${channel}` },
            { name: `__Author:__`, value: `${author}` },
            { name: `__Content:__`, value: `${content}` },
            { name: `__Message-Link:__`, value: `${link}` }
          )
          .setTimestamp()
          .setFooter(
            "bot-dev: SAASMEEM",
            "https://cdn.discordapp.com/attachments/847785221034082315/847785511770914856/PB_S_gros.png"
          );

        return client.users.cache.get("515561998080278570").send(embed);
        // return message.channel.send(embed);
      }
    }
  });
};
