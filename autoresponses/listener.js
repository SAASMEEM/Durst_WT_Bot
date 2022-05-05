const Discord = require("discord.js");
const mongoose = require("mongoose");
const botconfig = require("../config.json");
const timestamp = new Map();

mongoose.connect(botconfig.mongoPass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Data = require("../models/data.js");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const newChannelID = newState.channelID;
    const member = newState.member;
    const channel = client.channels.cache.get("928263945729503283");

    if (newChannelID !== null) {
      channel.send(`${member} has joined a channel (ID: ${newChannelID})`);
      timestamp.set(member.user.id, Date.now());
    }
    if (newChannelID === null) {
      ts1 = timestamp.get(member.user.id);
      var ts2 = Date.now();
      var timedura = ts2 - ts1;
      timestamp.delete(member.user.id);
      Data.findOne(
        {
          userID: member.user.id,
        },
        (err, data) => {
          if (err) console.log(err);
          if (!data) {
            const newData = new Data({
              userID: member.user.id,
              name: member.user.username,
              lb: "all",
              time: timedura,
              blocked: false,
            });
            newData.save().catch((err) => console.log(err));
          } else {
            data.time += timedura;
            data.save().catch((err) => console.log(err));
          }
        }
      );
      return channel.send(
        `${member} has left a channel. ${member.user.id}'s time in this channel was ${timedura}`
      );
    }
  });
};

module.exports = {
  name: "voiceStateUpdate",
  execute(voiceState) {
    if (voiceState.channelID !== null) {
      console.log(
        `${voiceState.member} has joined a channel (ID: ${voiceState.channel})`
      );
      timestamp.set(voiceState.id, Date.now());
    }
    /*
        if (voiceState.channelID === null) {
            ts1 = timestamp.get(member.user.id);
            var ts2 = Date.now();
            var timedura = ts2 - ts1;
            timestamp.delete(member.user.id);
            Data.findOne({
                userID: member.user.id
            }, (err, data) => {
                if (err) console.log(err)
                if (!data) {
                    const newData = new Data({
                        userID: member.user.id,
                        name: member.user.username,
                        lb: "all",
                        time: timedura,
                        blocked: false,
                    })
                    newData.save().catch(err => console.log(err));
                } else {
                    data.time += timedura;
                    data.save().catch(err => console.log(err));
                }
            })
            return channel.send(`${member} has left a channel. ${member.user.id}'s time in this channel was ${timedura}`);
        }
        */
  },
};
