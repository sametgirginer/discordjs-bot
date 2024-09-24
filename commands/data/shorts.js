const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const { sleep } = require('../../functions/helpers');
const { buildText } = require("../../functions/language");
const fs = require('fs');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    run: async (client, interaction) => {
        let url = interaction.options.getString('url');
        let regex = /https:\/\/(www.)?youtube.com\/shorts\/([a-zA-Z0-9]*)/;

        if (url.match(regex) == null) return interaction.reply({ content: await buildText("ytshorts_invaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        url = "https://www.youtube.com/watch?v=" + url.match(regex)[2]; 

        interaction.deferReply().then(async () => {
            if (!fs.existsSync(`data/ytshorts`)) fs.mkdirSync('data/ytshorts');
            let rnd = Math.ceil(Math.random() * 5000);
            let videoFile = `data/ytshorts/ytshorts-video-${rnd}.mp4`;
            
            ytdl(url, { filter: "videoandaudio" })
                .pipe(fs.createWriteStream(videoFile))
                .on("finish", async () => {
                    let stats = fs.statSync(videoFile);
                    stats.size = Math.round(stats.size / (1024*1024));
            
                    if (stats.size > 9) {
                        fs.unlinkSync(videoFile);
                        return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                            await sleep(5000);
                            interaction.deleteReply();
                        });
                    }
            
                    const shortsVideo = new AttachmentBuilder()
                        .setFile(videoFile)
                        .setName('ytshorts-video.mp4');
                        
                    const shortsButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                            .setURL(url)
                    );
                    
                    return interaction.editReply({ files: [shortsVideo], components: [shortsButton] }).then(async () => {
                        fs.unlinkSync(videoFile);
                    });
                })
                .on("error", async (err) => {
                    console.log(err);

                    if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                    interaction.editReply({ content: await buildText("ytshorts_error_data", client, { guild: interaction.guildId }), ephemeral: true }).then(async () => {
                        await sleep(5000);
                        interaction.deleteReply();
                    });
                });
        });
    },

    data: new SlashCommandBuilder()
        .setName('shorts')
        .setDescription('Retrieves the data on the YouTube Shorts link.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Example: https://www.youtube.com/shorts/xxx')
                .setRequired(true))
}