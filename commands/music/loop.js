const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'loop',
    aliases: ['döngü'],
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

            if (!serverQueue) return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);
            if (message.member.voice.channelId  != connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

            serverQueue.player.on(AudioPlayerStatus.Playing, () => {
                if (serverQueue.songs[0].loop) { 
                    serverQueue.songs[0].loop = false;
                    message.react('❌');
                } else {
                    serverQueue.songs[0].loop = true;
                    message.react('👍');
                }
            })

        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}