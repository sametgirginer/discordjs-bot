const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'sosyalmedya',
    aliases: ['instagram', 'twitter', 'facebook', 'discord'],
    category: 'info',
    description: 'Sosyal medya bilgilerini gösterir.',
    prefix: true,
    owner: true,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args.length) {
            var embed = new MessageEmbed()
                .setColor('#99ccff')
                .addField('Sosyal Medya & Bağlantılar',
                    stripIndents`
                        **Discord**
                        > https://discord.gg/amkanimecisi
                        \n**Instagram**
                        > https://instagram.com/amkanimecisi`, true)

            message.channel.send(embed);
        }
    }
}