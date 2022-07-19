const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'ban_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.mentions.members.size) return infoMsg(message, 'B20000', await buildText("ban_user_required", client, { guild: message.guild.id, message: message }), true, 5000);

        message.mentions.members.forEach(async member => {
            if (!member.bannable || member.permissions.has([PermissionFlagsBits.BanMembers]) || member.permissions.has([PermissionFlagsBits.KickMembers])) 
                return infoMsg(message, 'B20000', await buildText("ban_hierarchy", client, { guild: message.guild.id, message: message }), true, 5000);

            if(args[1]) {
                let reason = '';
                args.forEach(arg => {
                    if (`<@!${member.id}>` != arg) reason += `${arg} `;
                });

                member.ban({ days: 7, reason: `${reason}` });
                return infoMsg(message, '83eb34', await buildText("ban_banned_user_with_reason", client, { guild: message.guild.id, message: message, member: member, variables: [reason] }));
            } else {
                member.ban({ days: 7, reason: await buildText("no_reason", client, { guild: message.guild.id }) });
                return infoMsg(message, '83eb34', await buildText("ban_banned_user", client, { guild: message.guild.id, message: message, member: member }));
            }
        });
    }
}