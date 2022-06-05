const { AudioPlayerStatus } = require('@discordjs/voice');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'loop',
    category: 'music',
    description: 'music_loop_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            if (!serverQueue) return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);
            if (message.member.voice.channelId  != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

            if (serverQueue.player._state.status == "playing") {
                if (serverQueue.songs[0].loop) { 
                    serverQueue.songs[0].loop = false;
                    message.react('❌');
                } else {
                    serverQueue.songs[0].loop = true;
                    message.react('👍');
                }
            }

        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}