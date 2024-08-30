const { Scraper } = require('@the-convocation/twitter-scraper');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { twitterRegex } = require('../../functions/helpers');
const { buildText } = require('../../functions/language');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        if (process.env.twitterapptoken.length <= 0) return interaction.reply({ content: await buildText("command_inactive", client, { guild: interaction.guildId }), ephemeral: true })
        
        let url = interaction.options.getString('url');
        url = await twitterRegex(url, 2);
        let id = await twitterRegex(url, 6);

        if (id) {
            const scraper = new Scraper();
            let tweet = await scraper.getTweet(id);
            if (!tweet) return interaction.reply({ content: await buildText("twitter_notfound_media", client, { guild: interaction.guildId }), ephemeral: true }); 
            let title = tweet.text.replace(/http[s]?:\/\/t.co\/[a-zA-Z0-9]*/g, "");
            let selVar = [];

            if (tweet.videos.length > 0) {
                selVar['id'] = tweet.videos[0].id;
                selVar['url'] = tweet.videos[0].url;
                selVar['file'] = `data/twitter/${tweet.videos[0].id}.mp4`;
            } else {
                return interaction.reply({ content: await buildText("twitter_notfound_media", client, { guild: interaction.guildId }), ephemeral: true });
            }

            if (selVar.file) {
                interaction.deferReply().then(async () => {
                    if (!fs.existsSync(`data/twitter`)) fs.mkdirSync('data/twitter');
    
                    let video = new AttachmentBuilder()
                        .setFile(selVar.file)
                        .setName(`twitter-${selVar.id}.mp4`);
    
                    let twitterButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Twitter')
                            .setURL("https://" + url)
                    );
            
                    let fileExists = fs.existsSync(selVar.file);
                    if (!fileExists) {
                        ffmpeg(selVar.url)
                        .output(selVar.file)
                        .on('end', function() {
                            if (title.length > 0) {
                                interaction.editReply({ content: `> ${title}`, files: [video], components: [twitterButtons], embeds: [] }).then(() => {
                                    fs.unlinkSync(selVar.file);
                                });
                            } else {
                                interaction.editReply({ files: [video], components: [twitterButtons], embeds: [] }).then(() => {
                                    fs.unlinkSync(selVar.file);
                                });
                            }
                        })
                        .run();
                    } else {
                        return interaction.editReply({ content: await buildText("twitter_already_processing", client, { guild: interaction.guildId }), embeds: [] });
                    }
                });
            } else {
                return interaction.reply({ content: await buildText("twitter_notfound_media", client, { guild: interaction.guildId }), ephemeral: true });
            }
        } else {
            return interaction.reply({ content: await buildText("twitter_unvaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        }
    },

    data: new SlashCommandBuilder()
        .setName('twitter')
        .setDescription("Retrieves media from Twitter.")
        .setDescriptionLocalizations({
            tr : "Twitter sitesinden medya getirir.",
        })
        .setDMPermission(false)
        .addStringOption(option => 
			option.setName('url')
				.setDescription('You must enter the Twitter link.')
                .setDescriptionLocalizations({ 
                    tr : "Twitter bağlantısını girmelisiniz.",
                })
				.setRequired(true))
}
