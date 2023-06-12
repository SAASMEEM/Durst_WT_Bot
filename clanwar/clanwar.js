import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName(`clanwar`)
    .setDescription("Starte einen Clanwar!");

export async function execute(client, interaction) {
    // declare embed
    const tableEmbed = new MessageEmbed({
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
    const ReactionsRow1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setEmoji("✅")
            .setCustomId("join")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setEmoji("⛔")
            .setCustomId("leave")
            .setStyle("DANGER"),
        new MessageButton()
            .setEmoji("❔")
            .setCustomId("maybe")
            .setStyle("SECONDARY"),
        new MessageButton()
            .setEmoji("⚙️")
            .setCustomId("setting")
            .setStyle("PRIMARY")
    );
    const ReactionsRow2 = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel("Checkliste")
            .setURL(
                "https://docs.google.com/document/d/122R5Y0781w2aP26meX7Q0kLAGb_vvE_0jUju_FUm0W8"
            )
            .setStyle("LINK"),
        new MessageButton()
            .setLabel("Fahrzeugaufstellung")
            .setURL(
                "https://docs.google.com/spreadsheets/d/1bfej9szrHsddB29cabYDo1YZjqJ3amNAwhvNfDJzlAY"
            )
            .setStyle("LINK")
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

