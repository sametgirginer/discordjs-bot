const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const { download } = require('../../functions/download');
const { sleep } = require('../../functions/helpers');
const ffmpeg = require('fluent-ffmpeg');
const request = require("request");
const fs = require('fs');


module.exports = {
    run: async (client, interaction) => {
        let url = interaction.options.getString('url');
        let regex = /http(s)?:\/\/(\w.*\.)?reddit\.com\/r\/([a-zA-Z0-9]*?)\/comments\/([a-zA-Z0-9]*[/]?)/;
        if (!regex.test(url)) return interaction.reply({ content: await buildText("reddit_required_url", client, { guild: interaction.guildId }), ephemeral: true });

        url = (url.match(regex))[0];
        url = url.substring(0, url.length - 1) + ".json";

        var cooldownEmbed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(await buildText("reddit_processing_video", client, { guild: interaction.guildId, variables: [interaction.user.id] }))

        interaction.reply({ embeds: [cooldownEmbed] });

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
                                fs.unlinkSync(videoFile);
                                fs.unlinkSync(audioFile);

                                let stats = fs.statSync(mergedFile);
                                stats.size = Math.round(stats.size / (1024*1024));

                                if (stats.size > 9) {
                                    fs.unlinkSync(mergedFile);
                                    interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), embeds: [] });
                                    await sleep(5000);
                                    return interaction.deleteReply();
                                }

                                const redditVideo = new AttachmentBuilder()
                                    .setFile(mergedFile)
                                    .setName('reddit-video.mp4');
                                    
                                const redditButtons = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(`Reddit`)
                                        .setURL(`https://reddit.com${data['permalink']}`),
                                );
        
                                return interaction.editReply({ embeds: [], files: [redditVideo], components: [redditButtons] }).then(() => {
                                    fs.unlinkSync(mergedFile);
                                });
                            });
                    } catch (error) {
                        console.log(error);

                        if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                        if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
                        if (fs.existsSync(mergedFile)) fs.unlinkSync(mergedFile);
                        interaction.editReply({ content: await buildText("reddit_cannot_upload", client, { guild: interaction.guildId }), embeds: [] });
                        await sleep(5000);
                        return interaction.deleteReply();
                    }
                } else {
                    interaction.editReply({ content: await buildText("reddit_notfound_video", client, { guild: interaction.guildId }), embeds: [] });
                    await sleep(5000);
                    return interaction.deleteReply();
                }
            } else {
                interaction.editReply({ content: await buildText("reddit_data_error", client, { guild: interaction.guildId, variables: [interaction.user.id] }), embeds: [] });
                await sleep(5000);
                return interaction.deleteReply();
            }
        });
    },

    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Downloads videos from Reddit.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            tr: "Reddit sitesinden video indirir.",
        })
        .addStringOption(option => 
            option.setName('url')
                .setDescription('You must enter the Reddit link.')
                .setDescriptionLocalizations({ 
                    tr : "Reddit bağlantısını girmelisiniz.",
                })
                .setRequired(true))
}