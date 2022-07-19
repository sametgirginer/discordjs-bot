const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const { buildText } = require("../../functions/language");
const { download } = require('../../functions/download');
const { sleep } = require('../../functions/helpers');
const TikTokScraper = require("tiktok-scraper");
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        let url = interaction.options.getString('url');
        let regex = /http(s)?:\/\/(\w.*\.)?tiktok\.com\/([@a-zA-Z0-9._]*)\/video\/([0-9]*)/;

        if (url.match(regex) == null) return interaction.reply({ content: await buildText("tiktok_invaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        let videoId = url.match(regex)[4];

        interaction.deferReply().then(async () => {
            if (!fs.existsSync(`data/tiktok`)) fs.mkdirSync('data/tiktok');
            let rnd = Math.ceil(Math.random() * 5000);
            let videoFile = `data/tiktok/tiktok-video-${rnd}.mp4`;

            try {
                const options = {
                    filetype: 'json',
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                        "Referer": "https://www.tiktok.com/",
                        "Cookie": "tt_webid_v2=" + videoId
                    },
                }

                let video = (await TikTokScraper.getVideoMeta(url, options)).collector[0];
                await download(video.videoUrl, videoFile);

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
                    .setName('tiktok-video.mp4');
                    
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
                interaction.editReply({ content: await buildText("tiktok_error_data", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                    await sleep(5000);
                    interaction.deleteReply();
                });
            }
        });
    },

    data: new SlashCommandBuilder()
        .setName('tiktok')
        .setDescription('Retrieves the data on the Tiktok link.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Example: https://www.tiktok.com/@mudlusamoi/video/xxx')
                .setRequired(true))
}