const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'pause',
    aliases: ['unpause'],
    category: 'music',
    description: 'music_pause_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        try {
            if (!serverQueue) return infoMsg(message, 'B5200', `Şu anda herhangi bir şarkı oynatılmadığı için durdurulamıyor.`, true);

            if (serverQueue.player) {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true)

                if (serverQueue.player._state.status === "playing") {
                    await serverQueue.player.pause();
                    message.react('⏸️');
                } else if (serverQueue.player._state.status === "paused") {
                    await serverQueue.player.unpause();
                    message.react('▶️');
                }
            }

        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}