import { readFileSync } from "node:fs";
import {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionsBitField,
} from "discord.js";
import { checkPerm } from "../../import_folders/functions.js";

const botconfig = JSON.parse(readFileSync("./config.json"));

// Rules content
const discordRules = `Die [Nutzungsbedingungen](<https://discord.com/terms/>) (ToS) von Discord gelten für diesen Server.

1. Das Serverteam und seine Entscheidungen müssen respektiert werden.
2. Jegliche Form von Diskriminierung, Spam, Mobbing oder NSFW-Inhalten ist auf diesem Server nicht erlaubt.
3. Antisemitische, rassistische, sexistische, homophobe oder diskriminierende Äußerungen oder Handlungen sind nicht erlaubt.
4. Die Verwendung und Verbreitung von verfassungswidrigen Symbolen, Zeichen und Flaggen ist strengstens untersagt.
5. Avatare, Nicknamen und Beschreibungen dürfen keine pornographischen, rassistischen oder beleidigenden Inhalte beinhalten.
6. Jede Art von Werbung ist verboten. Dies gilt auch für Direktnachrichten.
7. Diskussionen sind respektvoll und konstruktiv zu führen.
8. Veröffentliche Beiträge in den dafür vorgesehenen Kanal.
9. Urheberrechtlich geschütztes Material darf nicht geteilt werden.
10. Achte darauf, keine sensiblen persönlichen Daten, weder deine eigenen noch die anderer Personen, auf dem Server zu veröffentlichen.
11. Unerlaubtes Stören von Voice-Chats wird nicht toleriert.
12. Das benutzen von Cheats, Hacks oder Modifikationen, die das Spiel verfälschen ist verboten.
13. Die Verwendung von Decals oder anderen Mitteln zur Herstellung oder Verbreitung von Nazisymbolen, verbotenen Zeichen, Flaggen oder beleidigenden/verletzenden Darstellungen ist strengstens untersagt.`;

const addOnRules = `Das Ausnutzen von Sicherheitslücken ist verboten. Das Serverteam behält sich das Recht vor, nach gesundem Menschenverstand zu entscheiden (Timeout, Kick, Ban).\n
Die Regeln gelten sowohl für den Discord-Server, als auch für alle Mitglieder der Kampfgruppen ingame.\n
Wenn du Hilfe benötigst oder Fragen hast wende dich an einen <@&${botconfig.uffzRoleId}>`;

// Command structure
export const data = new SlashCommandBuilder()
	.setName("rules")
	.setDescription("Displays server rules");

// Function to execute command
export async function execute(client, interaction) {
	const check = await checkPerm(
		interaction,
		PermissionsBitField.Flags.Administrator
	);
	if (!check) return;

	const discordRulesEmbed = new EmbedBuilder()
		.setTitle("Regeln")
		.setDescription(discordRules)
		.setColor("#FCD33F");

	const addOnRulesEmbed = new EmbedBuilder()
		.setTitle("\u200B")
		.setDescription(addOnRules)
		.setColor("#FCD33F")
		.setTimestamp();

	await interaction.reply({
		content: `Regeln werden erstellt<a:sesam_loading:847835764650016830>`,
		ephemeral: true,
	});
	await interaction.channel.send({
		embeds: [discordRulesEmbed, addOnRulesEmbed],
	});
}
