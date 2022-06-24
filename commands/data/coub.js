const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const Coub = require('coub-dl');
const request = require('request');
const fs = require('fs');

module.exports = {
    run: async (client, interaction) => {
        let category = interaction.options.getString('category');
		let query = interaction.options.getString('url');

        if (category) {
            let url = `https://coub.com/api/v2/timeline/random/${category}`;
            if (category === "random") url = `https://coub.com/api/v2/timeline/explore/random`;
    
            request({
                uri: url,
                json: true,
                jsonReplacer: true
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    url = body.coubs[0].permalink;        
                    getCoubVideo(client, interaction, url);
                }
            });
        } else if (query) {
            getCoubVideo(client, interaction, query)
        } else {
            return interaction.reply({ content: await buildText("coub_required_url_or_category", client, { guild: interaction.guildId }), ephemeral: true })
        }
    },

	data: new SlashCommandBuilder()
		.setName('coub')
		.setDescription('Creates video from coub.com.')
		.setDMPermission(true)
		.addStringOption(option =>
			option.setName('category')
				.setDescription('When you make a selection, videos will be brought from coub.com by category.')
				.setRequired(false)
				.addChoices(
					{ name: 'Random', value: 'random' },
					{ name: 'Anime', value: 'anime' },
					{ name: 'Animals & Pets', value: 'animals-pets' },
					{ name: 'Mashup', value: 'mashup' },
					{ name: 'Movies', value: 'movies' },
					{ name: 'Gaming', value: 'gaming' },
					{ name: 'Cartoons', value: 'cartoons' },
					{ name: 'Art & Design', value: 'art' },
					{ name: 'Music', value: 'music' },
					{ name: 'Sports', value: 'sports' },
					{ name: 'Science & Technology', value: 'science-technology' },
					{ name: 'Celebrity', value: 'celebrity' },
					{ name: 'Nature & Travel', value: 'nature-travel' },
					{ name: 'Fashion & Beauty', value: 'fashion' },
					{ name: 'Dance', value: 'dance' },
					{ name: 'Auto & Technique', value: 'cars' },
					{ name: 'Blogging', value: 'blogging' },
					{ name: 'Stand-up & Jokes', value: 'standup-jokes' },
					{ name: 'Live Pictures', value: 'live-pictures' },
					{ name: 'Food & Kitchen', value: 'food-kitchen' },
					{ name: 'Memes', value: 'memes' }
				))
		.addStringOption(option =>
			option.setName('url')
				.setDescription('You can search for any media you want.')
				.setRequired(false)
		)
}

async function getCoubVideo(client, interaction, url) {
    let channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);

    
    interaction.deferReply({ content: await buildText("coub_processing_video", client, { guild: interaction.guildId }) }).then(async () => {
        try {
            if (!fs.existsSync(`data/coub`)) fs.mkdirSync('data/coub');

            const file = `data/coub/output-${Math.ceil(Math.random() * 5000)}.mp4`;
            const coub = await Coub.fetch(url, "HIGH");

            if (coub.metadata.not_safe_for_work === true) 
                if (channel.nsfw === false) return interaction.editReply({ content: await buildText("coub_nsfw_video", client, { guild: interaction.guildId }), ephemeral: true });

            if (coub.duration < 5) coub.duration = 10;

            await coub.loop(10);
            await coub.attachAudio();
            await coub.addOption('-t', coub.duration);
            await coub.write(file);

            const coubVideo = new MessageAttachment(file, 'coub-video.mp4');
            const coubButton = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel(await buildText("coub_view_onsite", client, { guild: interaction.guildId }))
                    .setURL(`https://coub.com/view/${coub.metadata.permalink}`)
            );

            return interaction.editReply({ files: [coubVideo], components: [coubButton] }).then(() => {
                fs.unlinkSync(file);
            });
        } catch (error) {
            return interaction.editReply({ content: await buildText("coub_unvaild_url", client, { guild: interaction.guildId }), ephemeral: true });
        }
    });
}