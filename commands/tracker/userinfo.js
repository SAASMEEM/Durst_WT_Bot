const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const botconfig = require("../../config.json");
const Duration = require("humanize-duration");

mongoose.connect(botconfig.mongoPass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Data = require("../../models/data.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`userinfo`)
    .setDescription("Displays the time spent in voice channels")
    .addUserOption((option) =>
      option.setName("target").setDescription("Select a User")
    ),

  async execute(interaction) {
    const User = interaction.options.getUser("target") || interaction.user;
    if (!User)
      await interaction.reply({
        content: "Couldn't find user",
        ephemeral: true,
      });
    var infoembed = new Discord.MessageEmbed()
      .setColor("#880099")
      .setTitle(`${User.username}`)
      .setThumbnail(User.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    Data.findOne(
      {
        userID: User.id,
      },
      (err, data) => {
        if (err) console.log(err);
        if (!data) {
          infoembed.addFields({
            name: "This User has no profile set up!",
            value: `<@${User.id}> can create their profile by using voice-channel.`,
          });
          interaction.reply({ embeds: [infoembed] });
        } else {
          infoembed.addFields({ name: "Name:", value: `${data.name}` });
          infoembed.addFields({ name: "Nickname", value: `${data.nickname}` });
          infoembed.addFields({
            name: "Time:",
            value: `${Duration(data.time, { unit: ["h", "m"], round: true })}`,
          });
          infoembed.addFields({
            name: "Weekly Time:",
            value: `${Duration(data.timeweekly, {
              unit: ["h", "m"],
              round: true,
            })}`,
          });
          infoembed.addFields({ name: "Blocked:", value: `${data.blocked}` });
          interaction.reply({ embeds: [infoembed] });
        }
      }
    );
  },
};
