require("dotenv/config");
// Require the necessary discord.js classes
const fs = require("node:fs");
const process = require("node:process");

const { Client, Collection, Intents } = require("discord.js");

const { commands } = require("./commands/index.js");
const { events } = require("./events/index.js");

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = new Collection();

for (const command of commands) {
	client.commands.set(command.data.name, command);
	command.execute = command.execute.bind(null, client);
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

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

// Login to Discord with your client's token
client.login(process.env.token);
