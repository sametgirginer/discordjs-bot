const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'loop',
    aliases: ['döngü'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            if (!serverQueue) return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);

            if (serverQueue.connection.speaking.bitfield === 1) {
                if (message.member.voice.channelID  != serverQueue.connection.channel.id) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

                if (serverQueue.songs[0].loop) { 
                    serverQueue.songs[0].loop = false;
                    await message.react('❌');
                } else {
                    serverQueue.songs[0].loop = true;
                    await message.react('👍');
                }
            }
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}