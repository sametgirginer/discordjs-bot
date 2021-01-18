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
        const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return infoMsg(message, 'B5200', `Bu işlemi yapmak için ses kanalına bağlanmalısın.`, true);
		if (!serverQueue) return infoMsg(message, 'B5200', `Sırada şarkı olmadığı için geçilemiyor.`, true);
		serverQueue.connection.dispatcher.end();
    }
}