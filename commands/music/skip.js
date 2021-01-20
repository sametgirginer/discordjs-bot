const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'geç',
    aliases: ['skip'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            if (serverQueue.connection === undefined) return;
            if (message.member.voice.channel.id != serverQueue.connection.channel.id) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);
            if (!serverQueue) return infoMsg(message, 'B5200', `Sırada şarkı olmadığı için geçilemiyor.`, true);
            if (serverQueue.songs.length <= 1) return infoMsg(message, 'B5200', `Sırada bekleyen şarkı yok. Oynatılan şarkıyı durdurmak için ${process.env.prefix}durdur`, true, 5000);

            serverQueue.connection.dispatcher.end();
            await message.react('👍');
        } catch (error) {
            client.log.sendError(error, message);
        }
    }
}