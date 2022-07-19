const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const search = require('../../functions/search');

module.exports = {
	name: 'banner',
    category: 'info',
    description: 'banner_desc',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
		if ((!message.mentions.users.size && !args.length) || message.type === "REPLY") {
			const user = await client.users.fetch(message.author.id, { force: true });
            const bannerUrl = user.bannerURL({ format: 'png', dynamic: true, size: 4096 });
            if (!bannerUrl) return infoMsg(message, 'B20000', await buildText("banner_notfound", client, { guild: message.guild.id, message: message }), true, 5000);

			const avatarEmbed = new EmbedBuilder()
				.setColor('#adf542')
				.setAuthor({ name: 'Banner: ' + message.author.username + '#' + message.author.discriminator, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
				.setImage(bannerUrl)
				.setTimestamp()
				.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });
	
			return message.channel.send({ embeds: [avatarEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
					const bUser = await client.users.fetch(user.id, { force: true });
					const bannerUrl = bUser.bannerURL({ format: 'png', dynamic: true, size: 4096 });
                    if (!bannerUrl) return infoMsg(message, 'B20000', await buildText("banner_userbanner_notfound", client, { guild: message.guild.id, message: message }), true, 5000);

					const avatarEmbed = new EmbedBuilder()
						.setColor('#adf542')
						.setAuthor({ name: 'Banner: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
						.setImage(bannerUrl)
						.setTimestamp()
						.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

					return message.channel.send({ embeds: [avatarEmbed] });
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', await buildText("allowed_max_mention", client, { guild: message.guild.id, message: message }), true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);

			if (user) {
                const bannerUrl = user.bannerURL({ format: 'png', dynamic: true, size: 4096 });
                if (!bannerUrl) return infoMsg(message, 'B20000', await buildText("banner_userbanner_notfound", client, { guild: message.guild.id, message: message }), true, 5000);

				const avatarEmbed = new EmbedBuilder()
					.setColor('#adf542')
					.setAuthor({ name: 'Banner: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
					.setImage(bannerUrl)
					.setTimestamp()
					.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

				return message.channel.send({ embeds: [avatarEmbed] });
			} else {
				return infoMsg(message, 'B20000', await buildText("user_notfound", client, { guild: message.guild.id, message: message }), true, 5000);
			}
		}
    }
}