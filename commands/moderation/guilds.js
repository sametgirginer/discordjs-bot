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
        client.guilds.cache.forEach(g => {
            g.channels.cache.first().createInvite().then(inv => infoMsg(message, '65ed3b', `${g.name} | ${inv.url}`));
        });
    }
}