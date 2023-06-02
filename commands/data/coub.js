const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buildText } = require('../../functions/language');
const { fileSize } = require('../../functions/helpers');
const Coub = require('coub-dl');
const request = require('request');
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        let category = interaction.options.getString('category');
        let tag = interaction.options.getString('tag');
		let query = interaction.options.getString('url');
        let gif = interaction.options.getBoolean('gif');

        if (category || tag) {
            let url = "";
            if (category) {
                url = `https://coub.com/api/v2/timeline/random/${category}`;
                if (category == "Random") url = `https://coub.com/api/v2/timeline/explore/random`;
            } else if (tag) {
                url = `https://coub.com/api/v2/timeline/tag/${tag}`;
            }
    
            interaction.deferReply();

            request({
                uri: url,
                json: true,
                jsonReplacer: true
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    rnd = Math.floor(Math.random() * 10);
                    url = body.coubs[rnd].permalink;        
                    getCoubVideo(client, interaction, url, gif, true);
                }
            });
        } else if (query) {
            getCoubVideo(client, interaction, query, gif, false);
        } else {
            return interaction.reply({ content: await buildText("coub_required_url_or_category", client, { guild: interaction.guildId }), ephemeral: true })
        }
    },

	data: new SlashCommandBuilder()
		.setName('coub')
		.setDescription('Retrieves data from coub.com')
        .setDescriptionLocalizations({
            tr : "coub.com sitesinden veri getirir.",
        })
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('category')
				.setDescription('When you make a selection, video will be brought from coub.com by category.')
                .setNameLocalizations({
                    tr : "kategori",
                })
                .setDescriptionLocalizations({
                    tr : "Seçim yaptığınızda video kategoriye göre coub.com'dan getirilecektir.",
                })
				.setRequired(false)
				.addChoices(
					{ name: 'Random', value: 'Random'},
					{ name: 'Anime', value: 'anime' },
					{ name: 'Animals & Pets', value: 'animals-pets', name_localizations: { tr : "Hayvan"} },
					{ name: 'Mashup', value: 'mashup' },
					{ name: 'Movies', value: 'movies', name_localizations: { tr : "Film"} },
					{ name: 'Gaming', value: 'gaming', name_localizations: { tr : "Oyun"} },
					{ name: 'Cartoons', value: 'cartoons', name_localizations: { tr : "Çizgi Film"} },
					{ name: 'Art & Design', value: 'art', name_localizations: { tr : "Sanat & Tasarım"} },
					{ name: 'Music', value: 'music', name_localizations: { tr : "Müzik"} },
					{ name: 'Sports', value: 'sports', name_localizations: { tr : "Spor"} },
					{ name: 'Science & Technology', value: 'science-technology', name_localizations: { tr : "Bilim & Teknoloji"} },
					{ name: 'Celebrity', value: 'celebrity', name_localizations: { tr : "Ünlü"} },
					{ name: 'Nature & Travel', value: 'nature-travel', name_localizations: { tr : "Doğa & Seyehat"} },
					{ name: 'Fashion & Beauty', value: 'fashion', name_localizations: { tr : "Moda & Güzellik"} },
					{ name: 'Dance', value: 'dance', name_localizations: { tr : "Dans"} },
					{ name: 'Auto & Technique', value: 'cars', name_localizations: { tr : "Oto & Teknik"} },
					{ name: 'Blogging', value: 'blogging', name_localizations: { tr : "Blog"} },
					{ name: 'Stand-up & Jokes', value: 'standup-jokes' },
					{ name: 'Live Pictures', value: 'live-pictures' },
					{ name: 'Food & Kitchen', value: 'food-kitchen', name_localizations: { tr : "Yemek & Mutfak"} },
					{ name: 'Memes', value: 'memes', name_localizations: { tr : "Mizah"} }
				))
		.addStringOption(option =>
			option.setName('tag')
				.setDescription('You can search by a tag.')
                .setDescriptionLocalizations({ 
                    tr : "Bir etikete göre arama yapabilirsin.",
                })
				.setRequired(false)
		)
		.addStringOption(option =>
			option.setName('url')
				.setDescription('You must enter the Coub video link.')
                .setDescriptionLocalizations({ 
                    tr : "Coub video bağlantısını girmelisiniz.",
                })
				.setRequired(false)
		)
        .addBooleanOption(option => 
            option.setName('gif')
                .setDescription('Convert video to gif.')
                .setDescriptionLocalizations({
                    tr : "Videoyu gif'e dönüştürme.",
                })
                .setRequired(false))
}

async function getCoubVideo(client, interaction, url, gif, deferred) {
    let channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);

    if (deferred) interaction.editReply({ content: await buildText("coub_processing_video", client, { guild: interaction.guildId }) });
    else interaction.reply({ content: await buildText("coub_processing_video", client, { guild: interaction.guildId }) });

    try {
        if (!fs.existsSync(`data/coub`)) fs.mkdirSync('data/coub');

        var fileExtension = ".mp4";
        if (gif) fileExtension = ".gif";

        const file = `data/coub/output-${Math.ceil(Math.random() * 5000)}${fileExtension}`;
        const coub = await Coub.fetch(url, "HIGH");

        if (coub.metadata.not_safe_for_work === true) 
            if (channel.nsfw === false) return interaction.editReply({ content: await buildText("coub_nsfw_video", client, { guild: interaction.guildId }) });

        if (coub.duration < 5) coub.duration = 10;

        if (gif) {
            await coub.addOption('-f', "gif");
            await coub.scale('-2:300');
        } else {
            await coub.loop(10);
            await coub.attachAudio();
            await coub.addOption('-t', coub.duration);
        }

        await coub.write(file);

        if (await fileSize(file, 9)) {
            fs.unlinkSync(file);
            return interaction.editReply({ content: await buildText("file_size_large", client, { guild: interaction.guildId }) });
        }

        const coubVideo = new AttachmentBuilder()
            .setFile(file)
            .setName('coub-file' + fileExtension);

        const coubButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(await buildText("button_view_onsite", client, { guild: interaction.guildId }))
                .setURL(`https://coub.com/view/${coub.metadata.permalink}`)
        );

        return interaction.editReply({ content: await buildText("coub_file_uploaded", client, { guild: interaction.guildId }), files: [coubVideo], components: [coubButton] }).then(() => {
            fs.unlinkSync(file);
        });
    } catch (error) {
        console.log(error);
        return interaction.editReply({ content: await buildText("coub_unvaild_url", client, { guild: interaction.guildId }) });
    }
}