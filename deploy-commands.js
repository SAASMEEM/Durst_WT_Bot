import { env } from "node:process";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import { botId, guildId } from "./settings.js";
import { commands } from "./commands/index.js";

dotenv.config();

const commandJson = [];

for (const command of commands) {
	commandJson.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(env.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationGuildCommands(botId, guildId), {
			body: commandJson,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
