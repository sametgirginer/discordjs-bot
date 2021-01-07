const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');

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
            var commands = '';
            client.commands.forEach(cmd => {
                commands += `:small_orange_diamond: ${cmd.name} :black_small_square: ${cmd.description}\n`;
            });
    
            var yardimEmbed = new MessageEmbed()
                .setColor('#65bff0')
                .setAuthor('Bot Komutları', client.user.avatarURL({ format: 'png', dynamic: true }))
                .setDescription(`Komut hakkında ayrıntılı bilgi almak için: **${process.env.prefix}yardım** __komut adı__ \n\n` + commands)
                
            message.author.send(yardimEmbed).then(() => {
                infoMsg(message, '65bff0', `<@${message.author.id}>, bilgilendirme özel mesajdan iletildi.\nKomut hakkında ayrıntılı bilgi almak için: **${process.env.prefix}yardım** __komut adı__ `, true, 10000);
            }).catch(() => infoMsg(message, '65bff0', `<@${message.author.id}>, özel mesajın kapalı olduğu için yardım komutları iletilemedi.`, true, 10000));
        }

        if (args[0]) {
            var komutAdi;

            client.commands.forEach(cmd => {
                //console.log(cmd.aliases.filter());
                if (args[0] === cmd.name || args[0] === cmd.aliases) komutAdi = args[0];
            });

            if (komutAdi === undefined) {
                infoMsg(message, 'B20000', `<@${message.author.id}>, **${args[0]}** adında bir komut yok veya komut adı eksik girildi.`, true, 10000);
            } else {
                var cmdEmbed = new MessageEmbed()
					.setColor('#65bff0')
                    .setAuthor(`Komut adı: ${client.commands.get(args[0]).name}`, client.user.avatarURL({ format: 'png', dynamic: true }))
                    .setDescription(client.commands.get(args[0]).description)
                    .addField('Kategori', client.commands.get(args[0]).category, false)
                    .addField('Bot Sahibi', client.commands.get(args[0]).owner, false)
                    .addField('Destek Sunucusu', client.commands.get(args[0]).supportserver, false)

                message.channel.send(cmdEmbed);
                message.delete({ timeout: 5000, reason: 'Otomatik bot işlemi.' });
            }
        }
    }
}