const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { buildText } = require("../../functions/language");
const { download } = require("../../functions/download");
const { sleep } = require("../../functions/helpers");
const request = require("request");
const fs = require("fs");

module.exports = {
    run: async (client, interaction) => {
        if (process.env.instagramcookies.length <= 0) return interaction.reply({ content: await buildText("command_inactive", client, { guild: interaction.guildId }), ephemeral: true });
        
        let url = interaction.options.getString("url");
        let regex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([^/?#&]+)).*/;
        let match = url.match(regex);

        if (match) {
            interaction.deferReply().then(async () => {
                request({
                    uri: `https://www.instagram.com/p/${match[2]}/?__a=1&__d=dis`,
                    json: true,
                    jsonReplacer: true,
                    headers: {
                        "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                        "cookie" : process.env.instagramcookies,
                    }
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        if (body.graphql) {
                            let data = body.graphql.shortcode_media;

                            if (data.is_video) {
                                if (!fs.existsSync(`data/instagram`)) fs.mkdirSync('data/instagram');
                                let rnd = Math.ceil(Math.random() * 5000);
                                let videoFile = `data/instagram/insta-video-${rnd}.mp4`;
                        
                                try {
                                    await download(data.video_url, videoFile);
                        
                                    let stats = fs.statSync(videoFile);
                                    stats.size = Math.round(stats.size / (1024*1024));
                        
                                    if (stats.size > 9) {
                                        fs.unlinkSync(videoFile);
                                        return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                            await sleep(5000);
                                            interaction.deleteReply();
                                        });
                                    }
                        
                                    const tiktokVideo = new AttachmentBuilder()
                                        .setFile(videoFile)
                                        .setName('instagram-video.mp4');
                                        
                                    const tiktokButton = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Link)
                                            .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                            .setURL(url)
                                    );
                                
                                    return interaction.editReply({ files: [tiktokVideo], components: [tiktokButton] }).then(async () => {
                                        fs.unlinkSync(videoFile);
                                    });
                                } catch (error) {
                                    console.log(error);
                        
                                    if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                                    interaction.editReply({ content: await buildText("error_downloading_data", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                        await sleep(5000);
                                        interaction.deleteReply();
                                    });
                                }
                            } else {
                                return interaction.editReply({ content: await buildText("notfound_video", client, { guild: interaction.guildId }), ephemeral: true });
                            }
                        } else {
                            let data = body.items[0];

                            if (data.media_type === 2 || data.media_type === "VIDEO") {
                                if (!fs.existsSync(`data/instagram`)) fs.mkdirSync('data/instagram');
                                let rnd = Math.ceil(Math.random() * 5000);
                                let videoFile = `data/instagram/insta-video-${rnd}.mp4`;
                        
                                try {
                                    await download(data.video_versions[0].url, videoFile);
                        
                                    let stats = fs.statSync(videoFile);
                                    stats.size = Math.round(stats.size / (1024*1024));
                        
                                    if (stats.size > 9) {
                                        fs.unlinkSync(videoFile);
                                        return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                            await sleep(5000);
                                            interaction.deleteReply();
                                        });
                                    }
                        
                                    const tiktokVideo = new AttachmentBuilder()
                                        .setFile(videoFile)
                                        .setName('instagram-video.mp4');
                                        
                                    const tiktokButton = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Link)
                                            .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                            .setURL(url)
                                    );
                                
                                    return interaction.editReply({ files: [tiktokVideo], components: [tiktokButton] }).then(async () => {
                                        fs.unlinkSync(videoFile);
                                    });
                                } catch (error) {
                                    console.log(error);
                        
                                    if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                                    interaction.editReply({ content: await buildText("error_downloading_data", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                        await sleep(5000);
                                        interaction.deleteReply();
                                    });
                                }
                            } else {
                                return interaction.editReply({ content: await buildText("notfound_video", client, { guild: interaction.guildId }), ephemeral: true });
                            }
                        }
                    } else {
                        return interaction.editReply({ content: await buildText("notfound_media", client, { guild: interaction.guildId }), ephemeral: true });
                    }
                });
            });
        } else {
            return interaction.reply({ content: await buildText("unvaild_url", client, { guild: interaction.guildId, variables: ["https://www.instagram.com/p/XXXXXXX/"] }), ephemeral: true });
        }
    },

    data: new SlashCommandBuilder()
        .setName('instagram')
        .setDescription('Retrieves video from Instagram.')
        .setDescriptionLocalizations({
            tr : "Instagram sitesinden video getirir.",
        })
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Please enter a valid link.')
                .setDescriptionLocalizations({
                    tr : "Geçerli bir bağlantı giriniz.",
                })
                .setRequired(true))
}