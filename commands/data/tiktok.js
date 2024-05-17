const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const { sleep, getRedirectURL } = require('../../functions/helpers');
const { buildText } = require("../../functions/language");
const { download } = require('../../functions/download');
const htmlparser = require("htmlparser2");
const domutils = require("domutils");
const request = require("request");
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        let url = interaction.options.getString('url');
        let regex = /http(s)?:\/\/(\w.*\.)?tiktok\.com\/([@a-zA-Z0-9._]*)\/video\/([0-9]*)/;
        let shortregex = /http(s)?:\/\/vm.tiktok\.com\/([@a-zA-Z0-9._]*)/;

        if (url.match(regex) == null) {
            if (url.match(shortregex) != null) url = await getRedirectURL(url);
            else return interaction.reply({ content: await buildText("tiktok_invaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        }

        interaction.deferReply().then(async () => {
            if (!fs.existsSync(`data/tiktok`)) fs.mkdirSync('data/tiktok');
            let rnd = Math.ceil(Math.random() * 5000);
            let videoFile = `data/tiktok/tiktok-video-${rnd}.mp4`;

            try {
                request({
                    uri: url,
                    headers: {
                        "Referer": "https://www.tiktok.com/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                    }
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        let tikmeta;        
                        var handler = new htmlparser.DomHandler(async function(error, dom) {
                            if (error) {
                                return interaction.editReply({ content: await buildText("tiktok_error_data", client, { guild: interaction.guildId }), ephemeral: true });
                            } else {
                                const item = domutils.findOne(element => {
                                    const matches = element.attribs.id === '__UNIVERSAL_DATA_FOR_REHYDRATION__';
                                    return matches;
                            }, dom);
                                if (item) {
                                    tikmeta = JSON.parse(item.children[0].data).__DEFAULT_SCOPE__['webapp.video-detail'].itemInfo.itemStruct;
                                }
                            }
                        });
                        
                        var parser = new htmlparser.Parser(handler);
                        parser.write(body);
                        parser.end();

                        let videoURL = tikmeta.video.downloadAddr;
                        await download(videoURL, videoFile, response.headers['set-cookie']);

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
                    } else {
                        return interaction.reply({ content: await buildText("tiktok_error_data", client, { guild: interaction.guildId }), ephemeral: true });
                    }
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