const ConsoleTitle = require("node-bash-title");

module.exports = {
    name: 'ready',
    execute(client) {
        ConsoleTitle("Durst-WarThunder");
        console.clear();
        console.log(`Ready! Logged in as ${client.user.tag}`);

        //set BotStatus initial
        client.user.setPresence({
            activities: [{
                name: "War Thunder",
                type: "PLAYING"
            }],
            status: "idle"
        })
    }
};