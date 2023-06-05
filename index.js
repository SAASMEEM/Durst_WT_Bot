import { env } from "node:process";
import fs from "node:fs";
import dotenv from "dotenv";
import { Client, Collection, Intents } from "discord.js";

dotenv.config();

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});
client.commands = new Collection();

const load = async (client, dir = "./commands/") => {
	for (const dirs of await fs.promises.readdir(dir)) {
		const commandFiles = (await fs.promises.readdir(`${dir}/${dirs}`)).filter(
			(files) => files.endsWith(".js")
		);
		for (const file of commandFiles) {
			try {
				const { data, execute } = await import(`${dir}/${dirs}/${file}`);
				if (data) {
					client.commands.set(data.name, { data, execute });
					execute.bind(null, client);
				} else {
					console.log(`Invalid command module: ${dir}/${dirs}/${file}`);
				}
			} catch (error) {
				console.error(`Error loading command: ${dir}/${dirs}/${file}`, error);
			}
		}
	}
};

load(client);

const eventFiles = (await fs.promises.readdir("./events")).filter((file) =>
	file.endsWith(".js")
);
for (const file of eventFiles) {
	try {
		const { name, once, execute } = await import(`./events/${file}`);
		if (once) {
			client.once(name, (...args) => execute(...args));
		} else {
			client.on(name, (...args) => execute(...args));
		}
	} catch (error) {
		console.error(`Error loading event: ./events/${file}`, error);
	}
}

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

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
