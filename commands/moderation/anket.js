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
        if (!args.length) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, anket oluştur/bitir/sil komutlarından birini girmelisiniz.`);

        if (args[0] === 'oluştur' || args[0] === 'create') {
            infoMsg(message, '65bff0', `Oylanacak anket seçeneklerini giriniz.\nMaksimum girilebilecek seçenek sayısı: **9**`);

            const collectorFilter = m => m.author.id === message.author.id;
            const collector = new MessageCollector(message.channel, { filter: collectorFilter, time: 60000, idle: 20000 })
            const numberEmojies = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
            let surveyData = [];

            collector.on('collect', m => {
                m.delete();
                if (m.content === process.env.prefix + 'anket tamamla') collector.stop();
            });

            collector.on('end', collected => {
                collector.collected.forEach(c => {
                    if (c.content === process.env.prefix + 'anket tamamla') {
                        message.delete();
                        return;
                    }
                    surveyData.push(c);
                });

                let i = 0;
                let cleanData = {};
                let embedData = "";
                surveyData.forEach(survey => {
                    if (i > 8) return;
                    if (typeof survey.embeds[0] === "undefined") {
                        cleanData[numberEmojies[i]] = survey.content;
                        embedData += `${numberEmojies[i]}  ${survey.content}\n`;
                        i++;
                    }
                });

                var surveyEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor('Anket', message.author.avatarURL({ format: 'png', dynamic: true }))
                    .setDescription(`${embedData}`)
                    .setTimestamp()

                message.channel.send({ embeds: [surveyEmbed] }).then(async m => {
                    if (surveyData.length > 8) surveyData.length = 9;
                    for (let i = 0; i < surveyData.length; i++) {
                        await m.react(`${numberEmojies[i]}`);                        
                    }
                });
            });
        }
    }
}