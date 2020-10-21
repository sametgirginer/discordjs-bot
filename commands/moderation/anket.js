const { MessageCollector, MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const db = require('../../functions/database');

module.exports = {
    name: 'anket',
    category: 'moderasyon',
    description: 'Otomatik olarak bir anket hazırlar.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (!args.length) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, anket oluştur/bitir/sil komutlarından birini girmelisiniz.`, true, 10000);

        if (args[0] === 'oluştur' || args[0] === 'create') {
            infoMsg(message, '65bff0', `Oylanacak anket seçeneklerini giriniz.\nMaksimum girilebilecek seçenek sayısı: **9**`, true, 60000);

            const filter = m => m.author.id === message.author.id;
            const collector = new MessageCollector(message.channel, filter, { max: 10, time: 60000 })
            const numberEmojies = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
            let surveyData = [];

            collector.on('collect', m => {
                m.delete({ timeout: 5000, reason: 'Otomatik bot işlemi' });
                if (m.content === process.env.prefix + 'anket tamamla') collector.stop();
            });

            collector.on('end', collected => {
                collector.collected.forEach(c => {
                    if (c.content === process.env.prefix + 'anket tamamla') return;
                    surveyData.push(c.content);
                });

                let i = 0;
                let cleanData = {};
                let embedData = "";
                surveyData.forEach(survey => {
                    cleanData[numberEmojies[i]] = survey;
                    embedData += `${numberEmojies[i]} ${survey}\n`;

                    cleanData.length = i;
                    i++;
                });

                var surveyEmbed = new MessageEmbed()
                    .setColor('#' + (Math.random()*0xFFFFFF<<0).toString(16))
                    .setAuthor('Anket', message.author.avatarURL({ format: 'png', dynamic: true }))
                    .setDescription(`${embedData}`)
                    .setTimestamp()

                message.channel.send(surveyEmbed).then(async m => {
                    for (let i = 0; i < cleanData.length + 1; i++) {
                        await m.react(`${numberEmojies[i]}`);                        
                    }
                });
            });
        }
    }
}