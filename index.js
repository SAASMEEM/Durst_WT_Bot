require("dotenv/config");
// Require the necessary discord.js classes
const fs = require("fs");

const { Client, Collection, Intents } = require("discord.js");

const timestamp = new Map();

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});
client.commands = new Collection();

const load = (dir = "./commands/") => {
	fs.readdirSync(dir).forEach((dirs) => {
		const commandFiles = fs
			.readdirSync(`${dir}/${dirs}`)
			.filter((files) => files.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`${dir}/${dirs}/${file}`);
			// Set a new item in the Collection
			// With the key as the command name and the value as the exported module
			client.commands.set(command.data.name, command);
		}
	});
};
load();

const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
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
