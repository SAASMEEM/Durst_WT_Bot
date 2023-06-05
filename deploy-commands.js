import { env } from "node:process";
import fs, { readFileSync } from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
//import botconfig from "./config.json" assert { type: "json" };

const botconfig = JSON.parse(readFileSync("./config.json"));
dotenv.config();

const commands = [];
const dir = "./commands/";
for (const dirs of await fs.promises.readdir(dir)) {
	const commandFiles = (await fs.promises.readdir(`${dir}/${dirs}`)).filter(
		(files) => files.endsWith(".js")
	);

	for (const file of commandFiles) {
		try {
			const { data } = await import(`${dir}/${dirs}/${file}`);
			if (data) {
				commands.push(data);
			} else {
				console.log(`Invalid command module: ${dir}/${dirs}/${file}`);
			}
		} catch (error) {
			console.error(`Error importing module: ${dir}/${dirs}/${file}`, error);
		}
	}
}

const rest = new REST({ version: "9" }).setToken(env.token);

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
