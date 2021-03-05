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
            const vc = await client.voice.connections.find(vc => vc.channel.guild.id === message.guild.id);
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
        
            if (serverQueue != undefined) serverQueue.songs = [];
            else return infoMsg(message, 'B5200', `Şu anda oynatılan bir şarkı yok.`, true);

            if (serverQueue.connection.speaking.bitfield === 1) {
                if (message.member.voice.channelID != serverQueue.connection.channel.id) return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);
        
                if (serverQueue.connection != null) serverQueue.connection.dispatcher.end();
                else if (vc) await vc.disconnect();
            }
            
            queue.delete(message.guild.id);
            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}