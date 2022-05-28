const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { infoMsg } = require("../../functions/message");

module.exports = {
    name: 'emoji',
    category: 'info',
    description: 'Belirtilen emojiyi getirir.',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'RANDOM', `<@${message.author.id}>, bir emoji girilmedi.`, true, 5000);

        let regex = /<([a]?):([a-z-A-Z0-9_]*):([0-9]*)>/;
        let cdnEmojiURL = "https://cdn.discordapp.com/emojis/";
        let emojis = [];
        let number = 1;

        args.forEach(emoji => {
            if (regex.test(emoji)) {
                let em = emoji.match(regex);

                let emojiName = em[2];
                let emojiType = (em[1] == "a") ? ".gif" : ".png";
                let emojiURL = `${cdnEmojiURL}${em[3]}${emojiType}`;

                emojis.push({ number: number, name: emojiName, url: emojiURL });
                number++;        
            }
        });

        if (!emojis[0]) return infoMsg(message, 'RANDOM', `<@${message.author.id}>, emoji(ler) bulunamadı.`, true, 5000);

        emojis.forEach(emoji => {
            emoji.embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({ name: `Emoji: ${emoji.name}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
                .setImage(emoji.url)
                .setTimestamp()
                .setFooter({ text: `Emoji: ${emoji.number}/${emojis.length}` });

            if (emojis.length > 1)
                emoji.row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`${(emoji.number == 1) ? emojis.length : emoji.number - 1}`)
                            .setLabel('<')
                            .setStyle('PRIMARY'),

                        new MessageButton()
                            .setCustomId(`${(emoji.number == emojis.length) ? 1 : emoji.number + 1}`)
                            .setLabel('>')
                            .setStyle('PRIMARY'),

                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('\t')
                            .setURL(emoji.url)
                );
        });

        if (emojis.length > 1) {
            let lastEmoji = 0;
            const sm = await message.channel.send({ embeds: [emojis[0].embed], components: [emojis[0].row] });

            const filter = i => i.user.id === message.author.id;

            const collector = message.channel.createMessageComponentCollector({ filter, time: 10000 });
            
            collector.on('collect', async i => {
                lastEmoji = i.customId - 1;
                await i.update({ embeds: [emojis[i.customId - 1].embed], components: [emojis[i.customId - 1].row] });
            });

            collector.on('end', async collected => {
                sm.edit({ content: "İşlem süresi geçti.", embeds: [emojis[lastEmoji].embed], components: [] });
            });
        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('\t')
                        .setURL(emojis[0].url)
            );

            message.channel.send({ embeds: [emojis[0].embed], components: [row] });
        }
    }
}