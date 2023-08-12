import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName(`clanwar`)
    .setDescription("Starte einen Clanwar!");

export async function execute(client, interaction) {
    // declare embed
    const tableEmbed = new EmbedBuilder({
        color: "880099",
        title: `Clanwar`,
        description: `⏲️ <t:1703372400:R>`,
        fields: [
            { name: "✅Accepted:", value: "\u200B", inline: true },
            { name: "⛔Declined:", value: "\u200B", inline: true },
            { name: "❔Tentative:", value: "\u200B", inline: true },
        ],
        timestamp: Date.now(),
    });
    // declare buttons
    const ReactionsRow1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setEmoji("✅")
            .setCustomId("join")
            .setStyle("Success"),
        new ButtonBuilder()
            .setEmoji("⛔")
            .setCustomId("leave")
            .setStyle("Danger"),
        new ButtonBuilder()
            .setEmoji("❔")
            .setCustomId("tentative")
            .setStyle("Secondary"),
        new ButtonBuilder()
            .setEmoji("⚙️")
            .setCustomId("setting")
            .setStyle("Primary")
    );
    const ReactionsRow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Checkliste")
            .setURL(
                "https://docs.google.com/document/d/122R5Y0781w2aP26meX7Q0kLAGb_vvE_0jUju_FUm0W8"
            )
            .setStyle("Link"),
        new ButtonBuilder()
            .setLabel("Fahrzeugaufstellung")
            .setURL(
                "https://docs.google.com/spreadsheets/d/1bfej9szrHsddB29cabYDo1YZjqJ3amNAwhvNfDJzlAY"
            )
            .setStyle("Link")
    );
    await interaction.channel.send({
        embeds: [tableEmbed],
        components: [ReactionsRow1, ReactionsRow2],
        fetchReply: true,
    });
    await interaction.reply({
        content: `clanwar setup complete`,
        ephemeral: true,
    });
    const lastMessage = await interaction.channel.messages.fetch({ limit: 1 });
    const botLastMessage = lastMessage
        .filter((m) => m.author.id === client.user.id)
        .first();
    await interaction.channel.send(
        `My last message ID is \`${botLastMessage.id}\``
    );
}

