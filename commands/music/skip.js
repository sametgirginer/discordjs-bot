const { infoMsg } = require('../../functions/message');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'geç',
    aliases: ['skip'],
    category: 'music',
    description: 'Müzik komutu / aktif değil',
    prefix: true,
    owner: true,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const connection = getVoiceConnection(message.guild.id);
            const serverQueue = message.client.queue.get(message.guild.id);

            if (!serverQueue) return infoMsg(message, 'B5200', `Sırada şarkı olmadığı için geçilemiyor.`, true);
            if (serverQueue.songs.length <= 1) return infoMsg(message, 'B5200', `Sırada bekleyen şarkı yok. Oynatılan şarkıyı durdurmak için ${process.env.prefix}durdur`, true, 5000);

            if (serverQueue.player) {
                if (message.member.voice.channelId != connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

                if (serverQueue.connection != null) serverQueue.player.play(serverQueue.songs[1]);
                else if (connection) await connection.destory();
            }

            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}