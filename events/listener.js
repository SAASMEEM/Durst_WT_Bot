const Discord = require("discord.js");
const mongoose = require("mongoose");
const botconfig = require("../config.json");
const timestamp = new Map();

const Data = require("../models/data.js");

mongoose.connect(botconfig.mongoPass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
    if (newState.channelId !== null) {
      //console.log(`${newState.member} has joined a channel (ID: ${newState.channelId})`);
      timestamp.set(newState.id, Date.now());
    } else {
      ts1 = timestamp.get(newState.id);
      if (ts1 == undefined) {
        timedura = 0;
      } else {
        var ts2 = Date.now();
        var timedura = ts2 - ts1;
        timestamp.delete(newState.id);
      }
      Data.findOne(
        {
          userID: newState.id,
        },
        (err, data) => {
          if (err) console.log(err);
          if (!data) {
            const newData = new Data({
              userID: newState.id,
              name: "<@" + newState.id + ">",
              nickname:
                newState.member.nickname || newState.member.user.username,
              lb: "all",
              time: timedura,
              timeweekly: timedura,
              blocked: false,
            });
            newData.save().catch((err) => console.log(err));
          } else {
            data.time += timedura;
            data.timeweekly += timedura;
            data.save().catch((err) => console.log(err));
          }
        }
      );
      //console.log(`${newState.member} has left a channel. ${newState.id}'s time in this channel was ${timedura}`);
    }
  },
};
