const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kurallar',
    category: 'info',
    description: 'Keyubu discord sunucusunun kurallarını iletir.',
    prefix: true,
    owner: true,
    supportserver: true,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args.length) {
			const kurallarEmbed = new MessageEmbed()
				.setColor('#65bff0')
				.setAuthor(message.author.username + ', kuralları dikkate aldığın için teşekkürler!')
                .setTitle('Kuralları görmek için buraya tıkla.')
                .setURL('https://musteri.keyubu.com/discord/')
		
			return message.channel.send(kurallarEmbed).then(msg => {
                message.delete({ timeout: 250, reason: 'Otomatik bot işlemi.' });
                msg.delete({ timeout: 20000, reason: 'Otomatik bot işlemi.' });
            });
        }
    }
}