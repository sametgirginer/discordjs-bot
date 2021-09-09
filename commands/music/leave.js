const { infoMsg } = require('../../functions/message');
const { getVoiceConnection } = require('@discordjs/voice');

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
            const connection = getVoiceConnection(message.guild.id);
            const queue = message.client.queue;

            if (!connection) return infoMsg(message, 'B5200', `Şu anda ses kanalına bağlı değilim.`, true, 5000);
            if (message.member.voice.channelId != connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);
    
            queue.delete(message.guild.id);
            await connection.destroy();
            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}