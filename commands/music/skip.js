const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { play } = require('../../functions/voice/music');

module.exports = {
    name: 'skip',
    category: 'music',
    description: 'music_skip_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        try {
            if (!serverQueue) return infoMsg(message, 'B5200', `Sırada şarkı olmadığı için geçilemiyor.`, true);
            if (serverQueue.songs.length <= 1) return infoMsg(message, 'B5200', `Sırada bekleyen şarkı yok. Oynatılan şarkıyı durdurmak için ${process.env.prefix}durdur`, true, 5000);

            if (serverQueue.player) {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true)

                if (serverQueue.connection) {
                    serverQueue.songs.shift();
                    play(message, serverQueue.songs[0]);
                }
            }

            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}