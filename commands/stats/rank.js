const { MessageEmbed } = require('discord.js');
const levelSystem = require('../../functions/level');
const search = require('../../functions/search');

module.exports = {
    name: 'rank',
    category: 'stats',
    description: 'Rankı gösterir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!message.mentions.users.size && !args.length) {
            var rankEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Kullanıcı: ${message.author.username}`)
                .setDescription(`**${message.guild.name}**`)
                .addField('XP', await levelSystem.getXP(message.guild.id, message.author.id), true)
                .addField('Level', await levelSystem.getLevel(message.guild.id, message.author.id), true)
                .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .setTimestamp()
                .setFooter(message.author.username + '#' + message.author.discriminator)

            return message.channel.send(rankEmbed);
		} else if (message.mentions.users.size === 1) {
			message.mentions.users.map(async user => {
				for (i = message.mentions.users.size; i >= 1; i--) {
                    var rankEmbed = new MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle(`Kullanıcı: ${user.username}`)
                        .setDescription(`**${message.guild.name}**`)
                        .addField('XP', (await levelSystem.getXP(message.guild.id, user.id)) ? await levelSystem.getXP(message.guild.id, user.id) : 0, true)
                        .addField('Level', (await levelSystem.getLevel(message.guild.id, user.id)) ? await levelSystem.getLevel(message.guild.id, user.id) : 0, true)
                        .setThumbnail(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                        .setTimestamp()
                        .setFooter(message.author.username + '#' + message.author.discriminator)
        
                    return message.channel.send(rankEmbed);
				}
			});
		} else if (message.mentions.users.size > 1) {
			return infoMsg(message, 'B20000', `<@${message.author.id}>, birden fazla kişiyi etiketleyemezsin.`, true, 5000);
		} else {
			let user = await search.user(client, null, message, args[0]);

			if (user) {
                var rankEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`Kullanıcı: ${user.username}`)
                    .setDescription(`**${message.guild.name}**`)
                    .addField('XP', (await levelSystem.getXP(message.guild.id, user.id)) ? await levelSystem.getXP(message.guild.id, user.id) : 0, true)
                    .addField('Level', (await levelSystem.getLevel(message.guild.id, user.id)) ? await levelSystem.getLevel(message.guild.id, user.id) : 0, true)
                    .setThumbnail(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                    .setTimestamp()
                    .setFooter(message.author.username + '#' + message.author.discriminator)
        
                return message.channel.send(rankEmbed);
			} else {
				return infoMsg(message, 'B20000', `<@${message.author.id}>, kullanıcı bulunamadı.`, true, 5000);
			}
		}
    }
}