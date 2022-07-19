const { EmbedBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const { checkUsrName } = require('../../functions/helpers');
const levelSystem = require('../../functions/level');
const search = require('../../functions/search');

module.exports = {
    name: 'rank',
    category: 'stats',
    description: 'rank_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let username = await checkUsrName(message.author.username, 30);

        if (!message.mentions.users.size && !args.length) {
            var rankEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(await buildText("rank_user_title", client, { guild: message.guild.id, variables: [username] }))
                .setDescription(`**${message.guild.name}**`)
                .addFields([
                    { name: 'XP', value: (await levelSystem.getXP(message.guild.id, message.author.id)).toString(), inline: true },
                    { name: 'Level', value: (await levelSystem.getLevel(message.guild.id, message.author.id)).toString(), inline: true }
                ])
                .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .setTimestamp()
                .setFooter({ text: `${message.author.username}#${message.author.discriminator}` })

            return message.channel.send({ embeds: [rankEmbed] });
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
                    username = await checkUsrName(user.username, 30);

                    var rankEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle(await buildText("rank_user_title", client, { guild: message.guild.id, variables: [username] }))
                        .setDescription(`**${message.guild.name}**`)
                        .addFields([
                            { name: 'XP', value: ((await levelSystem.getXP(message.guild.id, user.id)) ? await levelSystem.getXP(message.guild.id, user.id) : 0).toString(), inline: true },
                            { name: 'Level', value: ((await levelSystem.getLevel(message.guild.id, user.id)) ? await levelSystem.getLevel(message.guild.id, user.id) : 0).toString(), inline: true }
                        ])
                        .setThumbnail(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                        .setTimestamp()
                        .setFooter({ text: `${message.author.username}#${message.author.discriminator}` })
        
                    return message.channel.send({ embeds: [rankEmbed] });
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', await buildText("allowed_max_mention", client, { guild: message.guild.id, message: message }), true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);

			if (user) {
                username = await checkUsrName(user.username, 30);

                var rankEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(await buildText("rank_user_title", client, { guild: message.guild.id, variables: [username] }))
                    .setDescription(`**${message.guild.name}**`)
                    .addFields([
                        { name: 'XP', value: ((await levelSystem.getXP(message.guild.id, user.id)) ? await levelSystem.getXP(message.guild.id, user.id) : 0).toString(), inline: true },
                        { name: 'Level', value: ((await levelSystem.getLevel(message.guild.id, user.id)) ? await levelSystem.getLevel(message.guild.id, user.id) : 0).toString(), inline: true }
                    ])
                    .setThumbnail(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                    .setTimestamp()
                    .setFooter({ text: `${message.author.username}#${message.author.discriminator}` })
        
                return message.channel.send({ embeds: [rankEmbed] });
			} else {
				return infoMsg(message, 'B20000', await buildText("user_notfound", client, { guild: message.guild.id, message: message }), true, 5000);
			}
		}
    }
}