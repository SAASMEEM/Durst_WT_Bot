import { readFileSync } from "node:fs";
import {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
} from "discord.js";
import { checkPerm } from "../../import_folders/functions.js";

const botconfig = JSON.parse(readFileSync("./config.json"));

// Rules content
const discordRules = `Die **[Nutzungsbedingungen](<https://discord.com/terms/>) (ToS)** von Discord gelten für diesen Server.

1. Das **Serverteam** und seine Entscheidungen müssen **respektiert** werden.
2. Wenn du **Hilfe** benötigst wende dich an einen <@&${botconfig.uffzRoleId}>.
3. Jegliche Form von **Diskriminierung, Spam, Mobbing oder NSFW-Inhalten** ist auf diesem Server **nicht erlaubt**. 
4. Jede Art von **Werbung** ist **verboten**. Dies gilt auch für **Direktnachrichten**.
5. Diskussionen sind **respektvoll und konstruktiv** zu führen.
6. Veröffentliche Beiträge in den dafür vorgesehenen Kanal.
7. **Urheberrechtlich geschütztes** Material darf **nicht geteilt** werden.
8. Achte darauf, **keine sensiblen persönlichen Daten**, weder deine eigenen noch die anderer Personen, auf dem Server zu **veröffentlichen**.
9. Unerlaubtes Stören von Voice-Chats wird nicht toleriert.`;

const inGameRules = `10. Benutze keine **Bugs, Cheats, Hacks oder Modifikationen**, die das Spiel verfälschen.
11. Respektiere andere Spieler und **verhalte dich fair**, unabhängig von ihrer Spielstärke.
12. Teamarbeit und Kooperation sind erwünscht; gehe **respektvoll** mit deinen Teammitgliedern um.
13. **Antisemitische, rassistische, sexistische, homophobe oder diskriminierende Äußerungen oder Handlungen sind nicht erlaubt**.
14. Die Verwendung von Decals oder anderen Mitteln zur Herstellung oder Verbreitung von **Nazisymbolen, verbotenen Zeichen, Flaggen oder beleidigenden/verletzenden Darstellungen ist strengstens untersagt**.`;

const addOnRules = `Das **Ausnutzen von Sicherheitslücken** ist **verboten**. Das Serverteam behält sich das Recht vor, nach gesundem Menschenverstand zu entscheiden (**Timeout, Kick, Ban**).`;

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
        .setTitle("Server-Regeln")
        .setDescription(discordRules)
        .setColor("#FF0000")

    const inGameRulesEmbed = new EmbedBuilder()
        .setTitle("Ingame-Regeln")
        .setDescription(inGameRules)
        .setColor("#FF0000")

    const addOnRulesEmbed = new EmbedBuilder()
        .setTitle("\u200B")
        .setDescription(addOnRules)
        .setColor("#0000FF")
        .setTimestamp();

    await interaction.reply({
        content: `Regeln werden erstellt<a:sesam_loading:847835764650016830>`,
        ephemeral: true,
    });
    await interaction.channel.send({ embeds: [discordRulesEmbed, inGameRulesEmbed, addOnRulesEmbed] });
}
