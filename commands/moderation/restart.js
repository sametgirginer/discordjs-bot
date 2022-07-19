const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'restart',
    aliases: ['res'],
    category: 'moderation',
    description: 'restart_desc',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: [PermissionFlagsBits.Administrator],
    run: async (client, message, args) => {
        message.reply({ content: await buildText("restart_restarting_bot", client, { guild: message.guild.id }), allowedMentions: { repliedUser: false } })

        setInterval(() => {
            process.exit(1);
        }, 2000);
    }
}