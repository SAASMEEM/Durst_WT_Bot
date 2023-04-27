require("dotenv/config");
const fs = require("node:fs");
const process = require("node:process");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const botconfig = require("./config.json");
const { commands } = require("./commands/index.js");

const commandJson = [];

for (const command of commands) {
	commandJson.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationGuildCommands(botconfig.botId, botconfig.guildId),
			{
				body: commandJson,
			}
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
