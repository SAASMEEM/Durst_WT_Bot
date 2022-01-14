const mongoose = require("mongoose");
const botconfig = require("../config.json");

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Status = require("../models/dbstatus.js");
module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(() => {
            Status.findOne({
                search: true,
            }, (err, status) => {
                if (err) console.log(err)
                if (!status) {
                    const newStatus = new Status({
                        name: "War Thunder",
                        type: "PLAYING",
                        state: "idle",
                        search: true,
                    })
                    newStatus.save().catch(err => console.log(err));
                }
                client.user.setPresence({ activities: [{ name: status.name, type: status.type }], status: status.state });
            })
        }, 1 * 60 * 1000);
    }
};