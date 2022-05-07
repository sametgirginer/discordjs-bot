const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'guild',
    aliases: ['guilds'],
    category: 'moderasyon',
    description: 'Botun aktif olduğu discord sunucularını görüntüler.',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: ['ADMINISTRATOR'],
    run: async (client, message, args) => {
        let guilds = "";
        let aend = 0;

        client.guilds.cache.forEach(async guild => {
            if (!guild.members.cache.get(client.user.id).permissions.has('CREATE_INSTANT_INVITE')) return;

            let channel = await guild.channels.cache.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')).random();

            if (channel) {
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
            if (aend === client.guilds.cache.size) return infoMsg(message, 'RANDOM', `${guilds}`);
        });
    }
}