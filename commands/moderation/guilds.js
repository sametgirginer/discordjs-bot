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

        client.guilds.cache.forEach(guild => {
            guilds += guild.name + "\n";
        });
        
        infoMsg(message, 'RANDOM', `${guilds}`);
    }
}