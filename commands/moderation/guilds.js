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
        client.guilds.cache.forEach(guild => {
            if (guild.member(client.user).hasPermission('CREATE_INSTANT_INVITE'))
                guild.channels.cache.first().createInvite().then(inv => infoMsg(message, '65ed3b', `${guild.name} | ${inv.url}`));
            else 
                infoMsg(message, '65ed3b', `${guild.name}`);
        });
    }
}