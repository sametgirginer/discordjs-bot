const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { getUserBannerUrl } = require('../../functions/banner');
const search = require('../../functions/search');

module.exports = {
	name: 'banner',
    category: 'info',
    description: 'Banner resmini ve bağlantısını iletir.',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		if (!message.mentions.users.size && !args.length) {
            const bannerUrl = await getUserBannerUrl(client, message.author.id, { size: 4096 });
            if (!bannerUrl) return infoMsg(message, 'B20000', `<@${message.author.id}>, bannerın yok.`, true, 5000);

			const avatarEmbed = new MessageEmbed()
				.setColor('#adf542')
				.setAuthor({ name: 'Banner: ' + message.author.username + '#' + message.author.discriminator, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
				.setImage(bannerUrl)
				.setTimestamp()
				.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });
	
			return message.channel.send({ embeds: [avatarEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
                    const bannerUrl = await getUserBannerUrl(client, user.id, { size: 4096 });
                    if (!bannerUrl) return infoMsg(message, 'B20000', `<@${message.author.id}>, kullanıcının bannerı yok.`, true, 5000);

					const avatarEmbed = new MessageEmbed()
						.setColor('#adf542')
						.setAuthor({ name: 'Banner: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
						.setImage(bannerUrl)
						.setTimestamp()
						.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });

					return message.channel.send({ embeds: [avatarEmbed] });
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', `<@${message.author.id}>, birden fazla kişiyi etiketleyemezsin.`, true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);

			if (user) {
                const bannerUrl = await getUserBannerUrl(client, user.id, { size: 4096 });
                if (!bannerUrl) return infoMsg(message, 'B20000', `<@${message.author.id}>, kullanıcının bannerı yok.`, true, 5000);

				const avatarEmbed = new MessageEmbed()
					.setColor('#adf542')
					.setAuthor({ name: 'Banner: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
					.setImage(bannerUrl)
					.setTimestamp()
					.setFooter({ text: message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.' });

				return message.channel.send({ embeds: [avatarEmbed] });
			} else {
				return infoMsg(message, 'B20000', `<@${message.author.id}>, kullanıcı bulunamadı.`, true, 5000);
			}
		}
    }
}