const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'ayrıl',
    aliases: ['leave', 'dc', 'disconnect'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const vc = await client.voice.connections.find(vc => vc.channel.guild.id === message.guild.id);

            if (!vc) return infoMsg(message, 'B5200', `Şu anda ses kanalına bağlı değilim.`, true, 5000);
            if (message.member.voice.channelID != vc.channel.id) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);
    
            await vc.disconnect();
            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}