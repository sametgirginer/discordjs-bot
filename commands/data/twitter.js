const { TwitterApi } = require('twitter-api-v2');
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { twitterRegex } = require('../../functions/helpers');
const { buildText } = require('../../functions/language');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const twitterClient = new TwitterApi(process.env.twitterapptoken);

module.exports = {
    name: 'twitter',
    category: 'data',
    description: 'twitter_desc',
    prefix: true,
    owner: false,
    permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        let id = await twitterRegex(args[0], 4);

        if (id) {
            let tweets = (await twitterClient.v1.get(`statuses/lookup.json`, { id: id }));
            let selVar = []; // Selected Variant

            tweets.forEach(async tweet => {
                if (tweet.extended_entities != undefined) {
                    tweet.extended_entities.media.forEach(async media => {
                        bitrateOld = 0; // Compare bitrates

                        // GIF : media.type === "animated_gif"
                        if (media.type === "video") {
                            media.video_info.variants.forEach(variant => {
                                if (bitrateOld <= variant.bitrate) {
                                    bitrateOld = variant.bitrate;
                                    selVar['id'] = tweet.id;
                                    selVar['title'] = tweet.text;
                                    selVar['videoURL'] = variant.url;
                                    selVar['outputFile'] = `data/twitter/${tweet.id}.mp4`;
                                }
                            });
                        } else {
                            return infoMsg(message, `B20000`, await buildText("twitter_notfound_video_or_gif", client, { guild: message.guild.id }), true, 5000);
                        }
                    });
                } else {
                    return infoMsg(message, `B20000`, await buildText("twitter_notfound_media", client, { guild: message.guild.id }), true, 5000);
                }
            });

            if (selVar['id']) {
                var cooldownEmbed = new EmbedBuilder()
                    .setColor('#d747ed')
                    .setDescription(await buildText("twitter_processing_media", client, { guild: message.guild.id, message: message }))

                message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
                    message.delete();
                    if (!fs.existsSync(`data/twitter`)) fs.mkdirSync('data/twitter');
    
                    let video = new AttachmentBuilder()
                        .setFile(selVar.outputFile)
                        .setName('twitter-video.mp4');

                    let twitterButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Twitter')
                            .setURL(args[0])
                    );
        
                    let fileExists = fs.existsSync(selVar.outputFile);
                    if (!fileExists) {
                        ffmpeg(selVar.videoURL)
                        .output(selVar.outputFile)
                        .on('end', function() {
                            message.channel.send({ files: [video], components: [twitterButtons] }).then(() => {
                                fs.unlinkSync(selVar.outputFile);
                                msg.delete();
                            });
                        })
                        .run();
                    } else {
                        msg.delete();
                        return infoMsg(message, `B20000`, await buildText("twitter_already_processing", client, { guild: message.guild.id }), true, 10000);
                    }
                })
            }
        } else {
            return infoMsg(message, `B20000`, await buildText("twitter_unvaild_url", client, { guild: message.guild.id }), true, 5000)
        }
    }
}
