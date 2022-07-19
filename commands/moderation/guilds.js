const { PermissionFlagsBits } = require('discord.js');
const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'guilds',
    category: 'moderation',
    description: 'guilds_desc',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: [PermissionFlagsBits.Administrator],
    run: async (client, message, args) => {
        let guilds = "";
        let aend = 0;

        client.guilds.cache.forEach(async guild => {
            let channel = await guild.channels.cache.filter(c => c.permissionsFor(client.user).has([PermissionFlagsBits.CreateInstantInvite])).random();

            if (channel && args[0] === "invite") {
                try {
                    let invite = await guild.invites.create(channel.id);
                    guilds += `${guild.name} - ${await invite.url}\n`;
                } catch (error) {
                    return;
                }
            } else {
                guilds += `${guild.name}\n`;
            }

            aend++;
            if (aend === client.guilds.cache.size) return infoMsg(message, 'Random', `${guilds}`);
        });
    }
}