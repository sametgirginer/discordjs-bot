const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    category: 'moderation',
    description: 'kick_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: [PermissionFlagsBits.KickMembers],
    run: async (client, message, args) => {
        if (!message.mentions.members.size) return infoMsg(message, 'Red', await buildText("kick_user_required", client, { guild: message.guild.id, message: message }), true, 5000);

        message.mentions.members.forEach(async member => {
            if (!member.kickable || member.permissions.has([PermissionFlagsBits.BanMembers]) || member.permissions.has([PermissionFlagsBits.KickMembers])) 
                return infoMsg(message, 'Red', await buildText("kick_hierarchy", client, { guild: message.guild.id, message: message }), true, 5000);

            if (args[1]) {
                let reason = '';
                args.forEach(arg => {
                    if (`<@!${member.id}>` != arg) reason += `${arg} `;
                });

                member.kick(reason);
                return infoMsg(message, '83eb34', await buildText("kick_kicked_user_with_reason", client, { guild: message.guild.id, message: message, member: member, variables: [reason] }));
            } else {
                member.kick(await buildText("no_reason", client, { guild: message.guild.id }));
                return infoMsg(message, '83eb34', await buildText("kick_kicked_user", client, { guild: message.guild.id, message: message, member: member }));
            }
        });
    }
}