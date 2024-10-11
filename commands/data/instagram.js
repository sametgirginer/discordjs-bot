const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { buildText } = require("../../functions/language");
const { download } = require("../../functions/download");
const { sleep, rotateMedia } = require("../../functions/helpers");
const puppeteer = require('puppeteer');
//const request = require("request");
const fs = require("fs");

module.exports = {
    run: async (client, interaction) => {
        //if (process.env.instagramcookies.length <= 0) return interaction.reply({ content: await buildText("command_inactive", client, { guild: interaction.guildId }), ephemeral: true });
        
        let url = interaction.options.getString("url");
        let regex = /((?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels)\/([^/?#&]+)).*/;
        let match = url.match(regex);

        if (match) {
            interaction.deferReply().then(async () => {
                const xhr_result = async (result) => {
                    if (result.data.xdt_shortcode_media) {
                        let data = result.data.xdt_shortcode_media;

                        if (data.edge_sidecar_to_children != undefined) {
                            data.edge_sidecar_to_children.edges.forEach(n => {
                                if (n.node.is_video) {
                                    data.is_video = true;
                                    data.video_url = n.node.video_url;
                                }
                            });
                        }

                        if (data.is_video) {
                            if (!fs.existsSync(`data/instagram`)) fs.mkdirSync('data/instagram');
                            let rnd = Math.ceil(Math.random() * 5000);
                            let videoFile = `data/instagram/insta-video-${rnd}.mp4`;
                    
                            try {
                                await download(data.video_url, videoFile);
                                if (interaction.options.getBoolean('rotate')) videoFile = await rotateMedia(videoFile);
                    
                                let stats = fs.statSync(videoFile);
                                stats.size = Math.round(stats.size / (1024*1024));
                    
                                if (stats.size > 9) {
                                    fs.unlinkSync(videoFile);
                                    return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                        await sleep(5000);
                                        interaction.deleteReply();
                                    });
                                }
                    
                                const instaVideo = new AttachmentBuilder()
                                    .setFile(videoFile)
                                    .setName('instagram-video.mp4');
                                    
                                const instaButton = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                        .setURL(url)
                                );
                            
                                return interaction.editReply({ files: [instaVideo], components: [instaButton] }).then(async () => {
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
                        return interaction.editReply({ content: await buildText("notfound_media", client, { guild: interaction.guildId }), ephemeral: true });
                    }
                }
                
                (async () => {
                    const browser = await puppeteer.launch({ headless: false });
                    const page = await browser.newPage();
                    await page.goto(`https://www.instagram.com/p/${match[2]}/`);

                    page.on('response', async (response) => {
                        const url = response.url();
                    
                        if (url.includes('query')) {
                            json = await response.json();
                            xhr_result(json);
                            await browser.close();
                        }
                    });
                })();

                /*
                request({
                    uri: `https://www.instagram.com/p/${match[2]}/?__a=1&__d=dis`,
                    json: true,
                    jsonReplacer: true,
                    headers: {
                        "user-agent" : process.env.useragent,
                        "cookie" : process.env.instagramcookies,
                    }
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        if (body.graphql) {
                            let data = body.graphql.shortcode_media;

                            if (data.edge_sidecar_to_children != undefined) {
                                data.edge_sidecar_to_children.edges.forEach(n => {
                                    if (n.node.is_video) {
                                        data.is_video = true;
                                        data.video_url = n.node.video_url;
                                    }
                                });
                            }

                            if (data.is_video) {
                                if (!fs.existsSync(`data/instagram`)) fs.mkdirSync('data/instagram');
                                let rnd = Math.ceil(Math.random() * 5000);
                                let videoFile = `data/instagram/insta-video-${rnd}.mp4`;
                        
                                try {
                                    await download(data.video_url, videoFile);
                                    if (interaction.options.getBoolean('rotate')) videoFile = await rotateMedia(videoFile);
                        
                                    let stats = fs.statSync(videoFile);
                                    stats.size = Math.round(stats.size / (1024*1024));
                        
                                    if (stats.size > 9) {
                                        fs.unlinkSync(videoFile);
                                        return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                            await sleep(5000);
                                            interaction.deleteReply();
                                        });
                                    }
                        
                                    const instaVideo = new AttachmentBuilder()
                                        .setFile(videoFile)
                                        .setName('instagram-video.mp4');
                                        
                                    const instaButton = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Link)
                                            .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                            .setURL(url)
                                    );
                                
                                    return interaction.editReply({ files: [instaVideo], components: [instaButton] }).then(async () => {
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

                            if (data.media_type === 8 || data.media_type === 2 || data.media_type === "VIDEO") {
                                let videoUrl = "";

                                if (data.carousel_media != undefined) {
                                    data.carousel_media.forEach(media => {
                                        if (media.media_type === 2) videoUrl = media.video_versions[0].url;
                                    });
                                } else {
                                    videoUrl = data.video_versions[0].url;
                                }

                                if (!fs.existsSync(`data/instagram`)) fs.mkdirSync('data/instagram');
                                let rnd = Math.ceil(Math.random() * 5000);
                                let videoFile = `data/instagram/insta-video-${rnd}.mp4`;
                        
                                try {
                                    await download(videoUrl, videoFile);
                                    if (interaction.options.getBoolean('rotate')) videoFile = await rotateMedia(videoFile);
                        
                                    let stats = fs.statSync(videoFile);
                                    stats.size = Math.round(stats.size / (1024*1024));
                        
                                    if (stats.size > 9) {
                                        fs.unlinkSync(videoFile);
                                        return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                                            await sleep(5000);
                                            interaction.deleteReply();
                                        });
                                    }
                        
                                    const instaVideo = new AttachmentBuilder()
                                        .setFile(videoFile)
                                        .setName('instagram-video.mp4');
                                        
                                    const instaButton = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Link)
                                            .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                            .setURL(url)
                                    );
                                
                                    return interaction.editReply({ files: [instaVideo], components: [instaButton] }).then(async () => {
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
                });*/
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
        .addBooleanOption(option => 
            option.setName('rotate')
                .setDescription('Rotate media horizontally.')
                .setDescriptionLocalizations({
                    tr : "Medyayı yatay olarak döndür.",
                })
                .setRequired(false))
}