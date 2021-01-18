const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'ayrıl',
    aliases: ['leave'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        const vc = await client.voice.connections.find(vc => vc.channel.guild.id === message.guild.id);

        if (!vc) return infoMsg(message, 'B5200', `Şu anda ses kanalına bağlı değilim.`, true);

        await vc.disconnect();
        return infoMsg(message, 'AA2300', `Ses kanalından ayrıldı.`);
    }
}