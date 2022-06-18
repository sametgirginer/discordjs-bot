const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { infoMsg } = require("../../functions/message");
const { buildText } = require('../../functions/language');
const { download } = require('../../functions/download');
const ffmpeg = require('fluent-ffmpeg');
const request = require("request");
const fs = require('fs');


module.exports = {
    name: 'reddit',
    category: 'data',
    description: 'reddit_desc',
    prefix: true,
    owner: false,
    permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let regex = /http(s)?:\/\/(\w.*\.)?reddit\.com\/r\/([a-zA-Z0-9]*?)\/comments\/([a-zA-Z0-9]*[/]?)/;
        if (!regex.test(args[0])) return infoMsg(message, `B20000`, await buildText("reddit_required_url", client, { guild: message.guild.id }), true, 5000);

        url = args[0];
        url = (url.match(regex))[0];
        url = url.substring(0, url.length - 1) + ".json";

        var cooldownEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(await buildText("reddit_processing_video", client, { guild: message.guild.id, message: message }))

        message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
            message.delete();

            request({
                uri: url,
                json: true,
                jsonReplacer: true
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let results = JSON.parse(JSON.stringify(await body));
                    let data = results[0].data.children[0].data;
    
                    if (data.is_video) {
                        if (!fs.existsSync(`data/reddit`)) fs.mkdirSync('data/reddit');
                        let rnd = Math.ceil(Math.random() * 5000);
                        let videoClean = data['secure_media']['reddit_video']['fallback_url'];
                        let video = videoClean.replace("?source=fallback", "").replace("720", "480").replace("1080", "480");
                        let audio = `${data['url_overridden_by_dest']}/HLS_AUDIO_64_K.aac`;
                        let videoFile = `data/reddit/output-video-${rnd}.mp4`;
                        let audioFile = `data/reddit/output-audio-${rnd}.acc`;
                        let mergedFile = `data/reddit/output-merged-video-${rnd}.mp4`;
    
                        await download(audio, audioFile);
                        await download(video, videoFile);

                        try {
                            new ffmpeg(videoFile)
                                .addInput(audioFile)
                                .saveToFile(mergedFile).on("end", async () => {
                                    msg.delete();
                                    fs.unlinkSync(videoFile);
                                    fs.unlinkSync(audioFile);

                                    let stats = fs.statSync(mergedFile);
                                    stats.size = Math.round(stats.size / (1024*1024));

                                    if (stats.size > 9) {
                                        fs.unlinkSync(mergedFile);
                                        return infoMsg(message, 'RANDOM', await buildText("reddit_cannot_upload", client, { guild: message.guild.id }), false, 10000);
                                    }

                                    const redditVideo = new MessageAttachment(mergedFile, 'reddit-video.mp4');
                                    const redditButtons = new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setStyle('LINK')
                                            .setLabel(`Reddit`)
                                            .setURL(`https://reddit.com${data['permalink']}`),
                                    );
            
                                    return message.channel.send({ content: `<@${message.author.id}>`, files: [redditVideo], components: [redditButtons], allowedMentions: { repliedUser: false } }).then(() => {
                                        fs.unlinkSync(mergedFile);
                                    });
                                });
                        } catch (error) {
                            console.log(error);

                            if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                            if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
                            if (fs.existsSync(mergedFile)) fs.unlinkSync(mergedFile);
                            infoMsg(message, 'RANDOM', await buildText("reddit_cannot_upload", client, { guild: message.guild.id }), false, 10000);
                        }
                    } else {
                        msg.delete();
                        infoMsg(message, 'RANDOM', await buildText("reddit_notfound_video", client, { guild: message.guild.id }), false, 5000);
                    }
                } else {
                    msg.delete();
                    infoMsg(message, 'B20000', await buildText("reddit_data_error", client, { guild: message.guild.id, message: message }), false, 5000)
                }
            });
        })
    }
}