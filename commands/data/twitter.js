const { TwitterApi } = require('twitter-api-v2');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { twitterRegex } = require('../../functions/helpers');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const twitterClient = new TwitterApi(process.env.twitterAppToken);

module.exports = {
    name: 'twitter',
    category: 'data',
    description: 'Twitter sitesinden medya getirir.',
    prefix: true,
    owner: false,
    permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let id = await twitterRegex(args[0], 4);

        if (id) {
            let tweets = (await twitterClient.v1.get(`statuses/lookup.json`, { id: id }));

            tweets.forEach(tweet => {
                if (tweet.extended_entities != undefined) {
                    tweet.extended_entities.media.forEach(media => {
                        bitrateOld = 0; // Compare bitrates
                        selVar = []; // Selected Variant
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
                    });
                } else return infoMsg(message, `B20000`, `Bu bağlantıdaki medyaya erişilemedi.`, true, 5000);
            });

            if (typeof selVar != 'undefined') {
                let video = new MessageAttachment(selVar.outputFile);
                let videoEmbed = new MessageEmbed()
                    .setTitle(`${selVar.title}`)
                    .attachFiles(video)
    
                let fileExists = fs.existsSync(selVar.outputFile);
                if (!fileExists) {
                    ffmpeg(selVar.videoURL)
                    .output(selVar.outputFile)
                    .on('end', function() {
                        message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
                        message.channel.send(videoEmbed).then(() => {
                            return fs.unlinkSync(selVar.outputFile);
                        });
                    })
                    .run();
                } else {
                    return infoMsg(message, `B20000`, `Belirttiğiniz bağlantı şu anda işlenmektedir. Lütfen tekrar işlem yapmayınız.`, true, 10000);
                }
            }
        } else {
            return infoMsg(message, `B20000`, `Geçerli bir bağlantı girmeniz gerekmektedir.`, true, 5000)
        }
    }
}
