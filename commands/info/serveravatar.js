const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { buildText } = require('../../functions/language');
const { infoMsg } = require('../../functions/message');
const search = require('../../functions/search');

module.exports = {
	name: 'savatar',
	aliases: ['sav'],
    category: 'info',
    description: 'serveravatar_desc',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
		if ((!message.mentions.users.size && !args.length) || message.type === "REPLY") {
			let member = await search.member(message);
			if (!member.avatar) return infoMsg(message, 'B20000', await buildText("serveravatar_notfound", client, { guild: message.guild.id, message: message }), true, 5000);

			const avatarEmbed = new EmbedBuilder()
				.setColor('#adf542')
				.setAuthor({ name: 'Server Avatar: ' + message.author.username + '#' + message.author.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
				.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });
	
			return message.channel.send({ embeds: [avatarEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
					let member = await search.member(message, user.id);

					const avatarEmbed = new EmbedBuilder()
						.setColor('#adf542')
						.setAuthor({ name: 'Server Avatar: ' + user.username + '#' + user.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
						.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
						.setTimestamp()
						.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

					return message.channel.send({ embeds: [avatarEmbed] });
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', await buildText("allowed_max_mention", client, { guild: message.guild.id, message: message }), true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);
			let member = await search.member(message, user.id);

			if (!user) return infoMsg(message, 'B20000', await buildText("user_notfound", client, { guild: message.guild.id, message: message }), true, 5000);
			if (!member.avatar) return infoMsg(message, 'B20000', await buildText("serveravatar_notfound", client, { guild: message.guild.id, message: message }), true, 5000);

			const avatarEmbed = new EmbedBuilder()
				.setColor('#adf542')
				.setAuthor({ name: 'Server Avatar: ' + user.username + '#' + user.discriminator, iconURL: member.avatarURL({ format: 'png', dynamic: true })})
				.setImage(member.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
				.setTimestamp()
				.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

			return message.channel.send({ embeds: [avatarEmbed] });
		}
    }
}