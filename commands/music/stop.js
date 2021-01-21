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
        try {
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
        
            if (serverQueue != undefined) serverQueue.songs = [];
            else return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);
            if (message.member.voice.channel.id != serverQueue.connection.channel.id) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);
    
            serverQueue.connection.dispatcher.end();
            queue.delete(message.guild.id);
            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}