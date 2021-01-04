const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');

module.exports = {
	name: 'avatar',
	aliases: ['av',],
    category: 'info',
    description: 'Avatar resmini ve bağlantısını iletir.',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		if (!message.mentions.users.size && !args.length) {
			const avatarEmbed = new MessageEmbed()
				.setColor('#adf542')
				.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL({ format: 'png', dynamic: true }))
				.setImage(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter(message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.');
	
			return message.channel.send(avatarEmbed);
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
					const avatarEmbed = new MessageEmbed()
						.setColor('#adf542')
						.setAuthor(user.username + '#' + user.discriminator, user.avatarURL({ format: 'png', dynamic: true }))
						.setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
						.setTimestamp()
						.setFooter(message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.');

					return message.channel.send(avatarEmbed);
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', `<@${message.author.id}>, birden fazla kişiyi etiketleyemezsin.`, true, 5000);
		}
    }
}