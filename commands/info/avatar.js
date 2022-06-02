const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const search = require('../../functions/search');

module.exports = {
	name: 'avatar',
	aliases: ['av',],
    category: 'info',
    description: 'avatar_desc',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		if ((!message.mentions.users.size && !args.length) || message.type === "REPLY") {
			const avatarEmbed = new MessageEmbed()
				.setColor('#adf542')
				.setAuthor({ name: 'Avatar: ' + message.author.username + '#' + message.author.discriminator, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
				.setImage(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });
	
			return message.channel.send({ embeds: [avatarEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
					const avatarEmbed = new MessageEmbed()
						.setColor('#adf542')
						.setAuthor({ name: 'Avatar: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
						.setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
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
				const avatarEmbed = new MessageEmbed()
					.setColor('#adf542')
					.setAuthor({ name: 'Avatar: ' + user.username + '#' + user.discriminator, iconURL: user.avatarURL({ format: 'png', dynamic: true }) })
					.setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
					.setTimestamp()
					.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

				return message.channel.send({ embeds: [avatarEmbed] });
			} else {
				return infoMsg(message, 'B20000', await buildText("user_notfound", client, { guild: message.guild.id, message: message }), true, 5000);
			}
		}
    }
}