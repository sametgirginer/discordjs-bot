const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const search = require('../../functions/search');

module.exports = {
	name: 'savatar',
	aliases: ['sav', 'gav'],
    category: 'info',
    description: 'Sunucuya özel avatar resmini ve bağlantısını iletir.',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		if (!message.mentions.users.size && !args.length) {
			let member = await search.member(message);
			if (!member.avatar) return infoMsg(message, 'B20000', `<@${message.author.id}>, sunucuya özel avatarınız bulunamadı.`, true, 5000);

			const avatarEmbed = new MessageEmbed()
				.setColor('#adf542')
				.setAuthor({ name: 'Sunucu avatarı: ' + message.author.username + '#' + message.author.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
				.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });
	
			return message.channel.send({ embeds: [avatarEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
					let member = await search.member(message, user.id);

					const avatarEmbed = new MessageEmbed()
						.setColor('#adf542')
						.setAuthor({ name: 'Sunucu avatarı: ' + user.username + '#' + user.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
						.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
						.setTimestamp()
						.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });

					return message.channel.send({ embeds: [avatarEmbed] });
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', `<@${message.author.id}>, birden fazla kişiyi etiketleyemezsin.`, true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);
			let member = await search.member(message, user.id);

			if (!user) return infoMsg(message, 'B20000', `<@${message.author.id}>, kullanıcı bulunamadı.`, true, 5000);
			if (!member.avatar) return infoMsg(message, 'B20000', `<@${message.author.id}>, sunucuya özel avatarınız bulunamadı.`, true, 5000);

			const avatarEmbed = new MessageEmbed()
				.setColor('#adf542')
				.setAuthor({ name: 'Sunucu avatarı: ' + user.username + '#' + user.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
				.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });

			return message.channel.send({ embeds: [avatarEmbed] });
		}
    }
}