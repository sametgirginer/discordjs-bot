const { TwitterApi } = require('twitter-api-v2');
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { twitterRegex, stringShort } = require('../../functions/helpers');
const { buildText } = require('../../functions/language');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const twitterClient = new TwitterApi(process.env.twitterAppToken);

module.exports = {
    name: 'twitter',
    category: 'data',
    description: 'twitter_desc',
    prefix: true,
    owner: false,
    permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let id = await twitterRegex(args[0], 4);

        if (id) {
            let tweets = (await twitterClient.v1.get(`statuses/lookup.json`, { id: id }));

            tweets.forEach(async tweet => {
                if (tweet.extended_entities != undefined) {
                    tweet.extended_entities.media.forEach(async media => {
                        bitrateOld = 0; // Compare bitrates
                        selVar = []; // Selected Variant
                        if (media.type === "video" || media.type === "animated_gif") {
                            media.video_info.variants.forEach(variant => {
                                if (bitrateOld <= variant.bitrate) {
                                    bitrateOld = variant.bitrate;
                                    selVar['id'] = tweet.id;
                                    selVar['title'] = tweet.text;
                                    selVar['videoURL'] = variant.url;
                                    if (variant.bitrate != 0) selVar['videoURL'] = (variant.url).substring(0, (variant.url).length - 7);
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
                var cooldownEmbed = new MessageEmbed()
                    .setColor('#d747ed')
                    .setDescription(await buildText("twitter_processing_media", client, { guild: message.guild.id, message: message }))

                message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
                    message.delete();
                    if (!fs.existsSync(`data/twitter`)) fs.mkdirSync('data/twitter');
    
                    let video = new MessageAttachment(selVar.outputFile);
                    let twitterButtons = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel(await stringShort(selVar.title, 30))
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
