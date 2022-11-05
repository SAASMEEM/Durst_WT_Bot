require("dotenv/config");
const fs = require("fs");
const process = require("process");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const botconfig = require("./config.json");

const commands = [];
const dir = "./commands/";
for (const dirs of fs.readdirSync(dir)) {
	const commandFiles = fs
		.readdirSync(`${dir}/${dirs}`)
		.filter((files) => files.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`${dir}/${dirs}/${file}`);
		commands.push(command.data.toJSON());

		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
	}
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationGuildCommands(botconfig.botId, botconfig.guildId),
			{
				body: commands,
			}
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
