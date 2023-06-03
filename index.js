import { env } from "node:process";

import dotenv from "dotenv";
// Require the necessary discord.js classes
import { Client, Intents } from "discord.js";

import { commands } from "./commands/index.js";
import { events } from "./events/index.js";

dotenv.config();

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

const commandMap = new Map();

for (const command of commands) {
	commandMap.set(command.data.name, command);
}

for (const event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = commandMap.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

// Login to Discord with your client's token
client.login(env.token);
