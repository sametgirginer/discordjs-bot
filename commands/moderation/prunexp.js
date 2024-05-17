const { infoMsg } = require('../../functions/message');
const { getXP } = require('../../functions/level');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'prunexp',
    category: 'moderation',
    description: 'prunexp_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: [PermissionFlagsBits.ManageGuild],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'Red', await buildText("prunexp_xp_required", client, { guild: message.guild.id, message: message }), true, 5000);

        let data = "";
        let count = 0;
        let xp = parseInt(args[0]);
        let guild = await client.guilds.fetch(message.guild.id, { force: true });

        message.guild.members.cache.forEach(async m => {
            mxp = await getXP(message.guild.id, m.id);
    
            if ((mxp === undefined && !m.user.bot) || (mxp != undefined && mxp <= xp))
                data += `<@${m.id}> - XP: ${mxp}\n`;
    
            if (data.length >= 1900) {
                message.channel.send({ content: data, allowedMentions: { repliedUser: false } });
                data = "";
            }

            count++;
            if (count >= guild.memberCount) message.channel.send({ content: data, allowedMentions: { repliedUser: false } });
        });
    }
}