const mongoose = require("mongoose");
const botconfig = require("../config.json");

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ConsoleTitle = require("node-bash-title");
const Status = require("../models/dbstatus.js");
const Data = require("../models/data");

module.exports = {
    name: 'ready',
    execute(client) {
        ConsoleTitle("Durst-WarThunder");
        console.clear();
        console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(() => {
            Status.findOne({
                search: true,
            }, (err, status) => {
                if (err) console.log(err)
                if (!status) {
                    status = new Status({
                        name: "War Thunder",
                        type: "PLAYING",
                        state: "idle",
                        search: true,
                    })
                    status.save().catch(err => console.log(err));
                }
                client.user.setPresence({ activities: [{ name: status.name, type: status.type }], status: status.state });
            })
        }, 1 * 60 * 1000);

        setInterval(() => {
            const d = new Date();
            let day = d.getUTCDay();
            let hour = d.getUTCHours();
            let minute = d.getUTCMinutes();
            let second = d.getUTCSeconds();

            if (day == 0 && hour == 3 && minute == 0 && second == 0) {
                let bulkArr = [
                    {
                        updateMany: {
                            filter: {},
                            update: { timeweekly: 0 }
                        }
                    },
                ];
                Data.bulkWrite(bulkArr);
            }
        }, 60 * 1000);
    }
};