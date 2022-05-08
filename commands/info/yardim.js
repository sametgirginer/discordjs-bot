const { MessageEmbed } = require('discord.js');
const { infoMsg, deleteMsg } = require('../../functions/message.js');

module.exports = {
    name: 'yardim',
    aliases: ['yardım', 'help'],
    category: 'info',
    description: 'Bot komutlarını iletir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args.length) {
            var commands = [];
            client.commands.forEach(cmd => {
                if (commands[cmd.category] === undefined) commands[cmd.category] = "`" + cmd.name + "`";
                else commands[cmd.category] += " `" + cmd.name + "`";
            });
    
            var yardimEmbed = new MessageEmbed()
                .setColor('#65bff0')
                .setAuthor({ name: 'Bot Komutları', iconURL: client.user.avatarURL({ format: 'png', dynamic: true }) })
                .setDescription(`Komut hakkında ayrıntılı bilgi almak için: **${process.env.prefix}yardım** __komut adı__`)
                .addField('Genel Komutlar', commands.info, false)
                .addField('Rank Komutları', commands.stats, false)
                .addField('Müzik Komutları', commands.music, false)
                .addField('Moderasyon Komutları', commands.moderasyon, false)

            message.channel.send({ embeds: [yardimEmbed] });
        }

        if (args[0]) {
            var komutAdi;

            client.commands.forEach(cmd => {
                if (args[0] === cmd.name || args[0] === cmd.aliases) komutAdi = args[0];
            });

            if (komutAdi === undefined) {
                infoMsg(message, 'B20000', `<@${message.author.id}>, **${args[0]}** adında bir komut yok veya komut adı eksik girildi.`, true, 10000);
            } else {
                let owner = (client.commands.get(args[0]).owner) ? "Evet" : "Hayır";
                let support = (client.commands.get(args[0]).supportserver) ? "Evet" : "Hayır";

                var cmdEmbed = new MessageEmbed()
					.setColor('#65bff0')
                    .setAuthor({ name: `Komut adı: ${client.commands.get(args[0]).name}`, iconURL: client.user.avatarURL({ format: 'png', dynamic: true }) })
                    .setDescription(client.commands.get(args[0]).description)
                    .addFields([
                        { name: 'Kategori', value: (client.commands.get(args[0]).category).toString(), inline: false },
                        { name: 'Sadece bot sahibi kullanabilir:', value: owner, inline: false },
                        { name: 'Sadece destek sunucusunda aktif:', value: support, inline: false }
                    ])

                message.channel.send({ embeds: [cmdEmbed] });
                deleteMsg(message, 5000);
            }
        }
    }
}