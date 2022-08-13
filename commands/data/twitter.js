const { TwitterApi } = require('twitter-api-v2');
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { twitterRegex } = require('../../functions/helpers');
const { buildText } = require('../../functions/language');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        if (process.env.twitterapptoken.length <= 0) return interaction.reply({ content: await buildText("command_inactive", client, { guild: interaction.guildId }), ephemeral: true })
        
        const twitterClient = new TwitterApi(process.env.twitterapptoken);
        let url = interaction.options.getString('url');
        let id = await twitterRegex(url, 4);

        if (id) {
            let tweet = await twitterClient.v2.tweets(id, { expansions: 'attachments.media_keys', "media.fields": "type,alt_text,variants" });
            let selVar = [];

            tweet.includes.media.forEach(async media => {
                if (media.variants != undefined) {
                    media.variants.forEach(async variant => {
                        selVar['id'] = tweet.data[0].id;
                        selVar['url'] = variant.url;
                        selVar['type'] = media.type;
                        selVar['text'] = tweet.data[0].text.replace(/http[s]?:\/\/t.co\/[a-zA-Z0-9]*/g, "");

                        if (media.type === "video") {
                            selVar['fileExtension'] = "mp4";
                            selVar['file'] = `data/twitter/${tweet.data[0].id}.${selVar['fileExtension']}`;
                        }

                        if (media.type === "animated_gif") {
                            selVar['fileExtension'] = "gif";
                            selVar['file'] = `data/twitter/${tweet.data[0].id}.${selVar['fileExtension']}`;
                        }
                    });
                }
            });

            if (selVar.file) {
                var cooldownEmbed = new EmbedBuilder()
                    .setColor('#d747ed')
                    .setDescription(await buildText("twitter_processing_media", client, { guild: interaction.guildId, variables: [interaction.user.id] }))

                interaction.reply({ embeds: [cooldownEmbed] });
                if (!fs.existsSync(`data/twitter`)) fs.mkdirSync('data/twitter');
    
                let video = new AttachmentBuilder()
                    .setFile(selVar.file)
                    .setName(`twitter-${selVar.type}.${selVar.fileExtension}`);

                let twitterButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Twitter')
                        .setURL(url)
                );
        
                let fileExists = fs.existsSync(selVar.file);
                if (!fileExists) {
                    ffmpeg(selVar.url)
                    .output(selVar.file)
                    .on('end', function() {
                        if (selVar.text.length > 0) {
                            interaction.editReply({ content: `> ${selVar.text}`, files: [video], components: [twitterButtons], embeds: [] }).then(() => {
                                fs.unlinkSync(selVar.file);
                            });
                        } else {
                            interaction.editReply({ files: [video], components: [twitterButtons], embeds: [] }).then(() => {
                                fs.unlinkSync(selVar.file);
                            });
                        }
                    })
                    .run();
                } else {
                    return interaction.editReply({ content: await buildText("twitter_already_processing", client, { guild: interaction.guildId }) });
                }
            } else {
                return interaction.reply({ content: await buildText("twitter_notfound_media", client, { guild: interaction.guildId }), ephemeral: true });
            }
        } else {
            return interaction.reply({ content: await buildText("twitter_unvaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        }
    },

    data: new SlashCommandBuilder()
        .setName('twitter')
        .setDescription("Retrieves media from Twitter.")
        .setDescriptionLocalizations({
            tr : "Twitter sitesinden medya getirir.",
        })
        .setDMPermission(false)
        .addStringOption(option => 
			option.setName('url')
				.setDescription('You must enter the Twitter link.')
                .setDescriptionLocalizations({ 
                    tr : "Twitter bağlantısını girmelisiniz.",
                })
				.setRequired(true))
}
