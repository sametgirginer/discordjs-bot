const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'sosyalmedya',
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
                .addField('Sosyal Medya', stripIndents`**Facebook**
                                       > https://fb.com/keyubu
                                       **Twitter**
                                       > https://twitter.com/keyubucom
                                       **Instagram**
                                       > https://instagram.com/keyubu`, true)
                .addField('Hesaplarımız', stripIndents`**Pinterest**
                                       > https://tr.pinterest.com/keyubu
                                       **Discord**
                                       > https://discord.me/keyubu
                                       **Youtube**
                                       > https://youtube.com/keyubu`, true)

            message.channel.send(embed);
        }
    }
}