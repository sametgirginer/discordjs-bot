const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const { getRedirectURL } = require('../../functions/helpers');
const { buildText } = require("../../functions/language");
const { download } = require('../../functions/download');
const htmlparser = require("htmlparser2");
const domutils = require("domutils");
const request = require("request");
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        let url = interaction.options.getString('url');
        let pinitregex = /http(s)?:\/\/(www)?pin.it\/([0-9a-zA-Z]*)/;
        let regex = /http(s)?:\/\/(\w.*\.)?([a-zA-Z][a-zA-Z].)?pinterest\.com\/pin\/([0-9]*?)\//;

        if (url.match(pinitregex)) url = await getRedirectURL(url);
        if (url.match(regex) == null) return interaction.reply({ content: await buildText("pinterest_invaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        let pinId = url.match(regex)[4];
        let pinURL = `https://pinterest.com/pin/${pinId}`;

        interaction.deferReply().then(async () => {
            try {
                request({
                    uri: pinURL,
                    json: true,
                    jsonReplacer: true,
                    headers: {
                        "user-agent" : process.env.useragent,
                        "cookie" : process.env.pinterestcookies,
                    }
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        let pin;
                        let title;

                        var handler = new htmlparser.DomHandler(async function(error, dom) {
                            if (error) {
                                return interaction.editReply({ content: await buildText("pinterest_error_pwsdata", client, { guild: interaction.guildId }), ephemeral: true });
                            } else {
                                const item = domutils.findOne(element => {
                                    const matches = element.attribs.id === '__PWS_DATA__';
                                    return matches;
                            }, dom);
                                if (item) {
                                    pin = (JSON.parse(item.children[0].data)).props.initialReduxState.pins[pinId];
                                    if (pin.title.length != 0) title = pin.title;
                                    else if (pin.rich_metadata != null) title = pin.rich_metadata.title;
                                    else if (pin.seo_title != null) title = pin.seo_title;
                                    else title = pin.pinner.username;

                                    if (pin.videos) pin.videos = pin.videos.video_list;
                                }
                            }
                        });
                          
                        var parser = new htmlparser.Parser(handler);
                        parser.write(body);
                        parser.end();
    
                        if (!pin.videos) {
                            const pinImageEmbed = new EmbedBuilder()
                                .setColor('Random')
                                .setAuthor({ name: title })
                                .setImage(pin.images.orig.url)
                                .setTimestamp()
                                .setFooter({ text: interaction.user.username + '#' + interaction.user.discriminator });
        
                            const pinButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                    .setURL(url)
                            );
                
                            return interaction.editReply({ embeds: [pinImageEmbed], components: [pinButton] });
                        } else {
                            if (!fs.existsSync(`data/pinterest`)) fs.mkdirSync('data/pinterest');
                            let rnd = Math.ceil(Math.random() * 5000);
                            let videoFile = `data/pinterest/pin-video-${rnd}.mp4`;

                            await download(pin.videos.V_720P.url, videoFile);

                            let stats = fs.statSync(videoFile);
                            stats.size = Math.round(stats.size / (1024*1024));

                            if (stats.size > 9) {
                                fs.unlinkSync(videoFile);
                                return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }), ephemeral: true });
                            }

                            const pinVideo = new AttachmentBuilder(videoFile, 'pin-video.mp4');
                            const pinButton = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                                    .setURL(url)
                            );
                
                            return interaction.editReply({ files: [pinVideo], components: [pinButton] }).then(async () => {
                                fs.unlinkSync(videoFile);
                            });
                        }
                    } else {
                        return interaction.reply({ content: await buildText("pinterest_error_pwsdata", client, { guild: interaction.guildId }), ephemeral: true });
                    }
                });
    
            } catch (error) {
                console.log(error);

                if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
                interaction.editReply({ content: await buildText("pinterest_error_pwsdata", client, { guild: interaction.guildId }), ephemeral: true })
            }
        });
    },

    data: new SlashCommandBuilder()
        .setName('pinterest')
        .setDescription('Retrieves the data on the Pinterest link.')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Example: https://pinterest.com/pin/xxx')
                .setRequired(true))
}