const { MessageCollector, EmbedBuilder } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'survey',
    aliases: ['anket'],
    category: 'moderation',
    description: 'survey_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (!args.length) return infoMsg(message, 'FFE26A', await buildText("survey_required_args", client, { guild: message.guild.id, message: message }), true, 10000);

        if (args[0] === 'oluştur' || args[0] === 'create') {
            infoMsg(message, '65bff0', await buildText("survey_max_item", client, { guild: message.guild.id }), false, 15000);

            const collectorFilter = m => m.author.id === message.author.id;
            const collector = new MessageCollector(message.channel, { filter: collectorFilter, time: 60000, idle: 20000 })
            const numberEmojies = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

            let surveyData = [];
            let collectLength = 0;

            collector.on('collect', async m => {
                if (m.content === process.env.prefix + 'survey complete' || m.content === process.env.prefix + 'anket tamamla') collector.stop();
                if (collectLength > 8) return collector.stop();

                collectLength++;
                m.delete();
            });

            collector.on('end', async collected => {
                collector.collected.forEach(async c => {
                    if (c.content === process.env.prefix + 'survey complete' || c.content === process.env.prefix + 'anket tamamla') return message.delete();
                    surveyData.push(c);
                });

                let i = 0;
                let cleanData = {};
                let embedData = "";
                surveyData.forEach(survey => {
                    if (i > 8) return;
                    if (typeof survey.embeds[0] === "undefined") {
                        cleanData[numberEmojies[i]] = survey.content;
                        embedData += `${numberEmojies[i]}\t${survey.content}\n`;
                        i++;
                    }
                });

                var surveyEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setAuthor({ name: await buildText("survey_title", client, { guild: message.guild.id }), iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
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