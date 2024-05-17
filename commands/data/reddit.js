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

        interaction.deferReply().then(async () => {
            request({
                uri: url,
                json: true,
                jsonReplacer: true,
                headers: {
                    "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
                }
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let results = JSON.parse(JSON.stringify(await body));
                    let data = results[0].data.children[0].data;

                    if (data.is_video) {
                        if (!fs.existsSync(`data/reddit`)) fs.mkdirSync('data/reddit');
                        let rnd = Math.ceil(Math.random() * 5000);
                        let video = (data['secure_media']['reddit_video']['fallback_url']).replace("?source=fallback", "").replace("DASH_96", "DASH_720").replace("DASH_1080", "DASH_720");
                        let audio = `${data['url_overridden_by_dest']}/DASH_AUDIO_64.mp4`;
                        let videoFile = `data/reddit/output-video-${rnd}.mp4`;
                        let audioFile = `data/reddit/output-audio-${rnd}.aac`;
                        let mergedFile = `data/reddit/output-merged-video-${rnd}.mp4`;
        
                        await download(video, videoFile);
                        request({
                            uri: `${audio}`,
                        }, async function(err, response, body) {
                            if (response.statusCode === 200) {
                                await download(`${audio}.aac`, audioFile);
                            } else {
                                audioFile = `data/reddit/output-audio-${rnd}.ts`;
                                await download(`${audio}.ts`, audioFile);
                            }
    
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
                        });
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