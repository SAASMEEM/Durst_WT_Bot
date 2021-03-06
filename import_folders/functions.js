function getMentionedMember(mention, message) {
    if (!mention) return;
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
    }
    return message.guild.members.cache.get(mention);
}

function getMentionedUser(mention, client) {
    if (!mention) return;
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
    }
    return client.users.cache.get(mention);
}

async function checkPerms(interaction, userId, roleId, channelId) {
    if (userId) {
        if (interaction.member.id !== userId) {
            await interaction.reply({ content: `Only <@${userId}> can use this command`, ephemeral: true })
            return false
        }
    }
    if (roleId) {
        if (!interaction.member.roles.cache.has(roleId)) {
            await interaction.reply({ content: `Only <@&${roleId}> can use this command`, ephemeral: true })
            return false
        }
    }
    if (channelId) {
        if (interaction.channel.id !== channelId) {
            await interaction.reply({ content: `You can only use this command in <#${channelId}>`, ephemeral: true })
            return false
        }
    }
    return true
}

module.exports = { getMentionedUser, getMentionedMember, checkPerms };