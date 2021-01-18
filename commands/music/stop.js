const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'durdur',
    aliases: ['stop'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return infoMsg(message, 'B5200', `Bu işlemi yapmak için ses kanalına bağlanmalısın.`, true);
        if (serverQueue != undefined) serverQueue.songs = [];
        else return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);
		serverQueue.connection.dispatcher.end();
    }
}