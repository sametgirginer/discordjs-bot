const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { infoMsg } = require("../../functions/message");
const { buildText } = require("../../functions/language");

module.exports = {
    name: 'emoji',
    category: 'info',
    description: 'emoji_desc',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'Random', await buildText("emoji_required_arg", client, { guild: message.guild.id, message: message }), true, 5000);

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

        if (!emojis[0]) return infoMsg(message, 'Random', await buildText("emoji_not_found", client, { guild: message.guild.id, message: message }), true, 5000);

        emojis.forEach(emoji => {
            let rnd = Math.ceil(Math.random() * 10000);

            emoji.embed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: `Emoji: ${emoji.name}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
                .setImage(emoji.url)
                .setTimestamp()
                .setFooter({ text: `Emoji: ${emoji.number}/${emojis.length}` });

            if (emojis.length > 1)
                emoji.row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${rnd}-prev-${(emoji.number === 1) ? emojis.length : emoji.number - 1}`)
                            .setLabel('<')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId(`${rnd}-next-${(emoji.number === emojis.length) ? 1 : emoji.number + 1}`)
                            .setLabel('>')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Link')
                            .setURL(emoji.url)
                );
        });

        if (emojis.length > 1) {
            let emojiId = 0;
            const sm = await message.channel.send({ embeds: [emojis[0].embed], components: [emojis[0].row] });

            const filter = i => i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
            
            collector.on('collect', async i => {
                emojiId = i.customId.charAt(i.customId.length - 1) - 1;
                await i.update({ embeds: [emojis[emojiId].embed], components: [emojis[emojiId].row] });
            });

            collector.on('end', async collected => {
                sm.edit({ content: await buildText("emoji_buttontime_over", client, { guild: message.guild.id, message: message }), embeds: [emojis[emojiId].embed], components: [] });
            });
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('\t')
                        .setURL(emojis[0].url)
            );

            message.channel.send({ embeds: [emojis[0].embed], components: [row] });
        }
    }
}