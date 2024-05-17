const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { buildText } = require("../../functions/language");

module.exports = {
    run: async (client, interaction) => {
        let text = interaction.options.getString('text');
        let data = text.split(">");

        let regex = /<([a]?):([a-z-A-Z0-9_]*):([0-9]*)/;
        let cdnEmojiURL = "https://cdn.discordapp.com/emojis/";
        let emojis = [];
        let number = 1;
        
        data.forEach(emoji => {
            if (regex.test(emoji)) {
                let em = emoji.match(regex);

                let emojiName = em[2];
                let emojiType = (em[1] == "a") ? ".gif" : ".png";
                let emojiURL = `${cdnEmojiURL}${em[3]}${emojiType}`;

                emojis.push({ number: number, name: emojiName, url: emojiURL });
                number++;        
            }
        });

        if (!emojis[0]) return interaction.reply({ content: await buildText("emoji_not_found", client, { guild: interaction.guildId }), ephemeral: true });

        let rnd = Math.ceil(Math.random() * 10000);
        emojis.forEach(emoji => {
            emoji.embed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: `Emoji: ${emoji.name}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true }) })
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
            interaction.reply({ embeds: [emojis[0].embed], components: [emojis[0].row] });

            const filter = i => i.user.id === interaction.user.id && i.customId.includes(rnd);
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });
            
            collector.on('collect', async i => {
                emojiId = i.customId.charAt(i.customId.length - 1) - 1;
                await i.update({ embeds: [emojis[emojiId].embed], components: [emojis[emojiId].row] });
            });

            collector.on('end', async collected => {
                interaction.editReply({ content: await buildText("emoji_buttontime_over", client, { guild: interaction.guildId }), embeds: [emojis[emojiId].embed], components: [] });
            });
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Link')
                        .setURL(emojis[0].url)
            );

            interaction.reply({ embeds: [emojis[0].embed], components: [row] });
        }
    },

    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Get emoji image.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Enter emoji.')
                .setRequired(true))
}