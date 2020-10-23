const { MessageEmbed } = require('discord.js');
const levelSystem = require('../../functions/level');

module.exports = {
    name: 'rank',
    category: 'stats',
    description: 'Rankı gösterir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        var rankEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Kullanıcı: ${message.author.username}`)
            .setDescription(`**${message.guild.name}**`)
            .addField('XP', await levelSystem.getXP(message.guild.id, message.author.id), true)
            .addField('Level', await levelSystem.getLevel(message.guild.id, message.author.id), true)
            .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setTimestamp()
            .setFooter(message.author.username + '#' + message.author.discriminator)

        message.channel.send(rankEmbed);
    }
}