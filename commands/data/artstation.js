const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const request = require("request");

module.exports = {
    run: async (client, interaction) => {
		let apiUrl = "https://www.artstation.com/random_project.json?&category=";
		let category = interaction.options.getString('category');
		let query = interaction.options.getString('search');

		if (category) apiUrl = `https://www.artstation.com/random_project.json?&category=${category}`;
		else if (query) apiUrl = `https://www.artstation.com/api/v2/search/projects.json?query="${query}"&page=1&per_page=75&sorting=relevance`;

		request({
			url: apiUrl,
			json: true,
			jsonReplacer: true
		}, async function(err, response, body) {
			if (!err && response.statusCode === 200) {
				let out = JSON.parse(JSON.stringify(await body));

				if (out.id != undefined) {
					const artEmbed = new EmbedBuilder()
						.setColor('Random')
						.setDescription(await buildText("artstation_click_here", client, { guild: interaction.guildId, variables: [out.permalink] }))
						.setAuthor({ name: out.title, url: out.user.medium_avatar_url })
						.addFields([
							{ name: await buildText("artstation_views", client, { guild: interaction.guildId }), value: (out.views_count).toString(), inline: true },
							{ name: await buildText("artstation_likes", client, { guild: interaction.guildId }), value: (out.likes_count).toString(), inline: true },
							{ name: await buildText("artstation_comments", client, { guild: interaction.guildId }), value: (out.comments_count).toString(), inline: true }
						])
						.setImage(out.cover.large_image_url)
						.setTimestamp()
						.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

					return interaction.reply({ embeds: [artEmbed] });
				} else {
					let page = Math.floor(Math.random() * (((out.total_count / 75) === 0) ? 1 : Math.floor(out.total_count / 75)) + 1);
					apiUrl = `https://www.artstation.com/api/v2/search/projects.json?query="${query}"&page=${page}&per_page=75&sorting=relevance`;

					request({
						url: apiUrl,
						json: true,
						jsonReplacer: true
					}, async function(err, response, body) {
						if (!err && response.statusCode === 200) {
							out = JSON.parse(JSON.stringify(await body));

							let rn = Math.floor((Math.random() * 1) * Math.floor((out.total_count < 75) ? out.total_count-1 : 74));
							if (out.total_count === 0) return interaction.reply({ content: await buildText("artstation_not_found", client, { guild: interaction.guildId, variables: [query] }), ephemeral: true })
		
							let channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);
							if (out.data[rn].hide_as_adult === true)
								if (channel.nsfw === false) return interaction.reply({ content: await buildText("artstation_nsfw_content", client, { guild: interaction.guildId }), ephemeral: true })
						
							out.total_count = (out.total_count-1 === 0) ? 1 : out.total_count - 1;
							const artEmbed = new EmbedBuilder()
								.setColor('Random')
								.setDescription(await buildText("artstation_search_found", client, { guild: interaction.guildId, variables: [query, out.total_count, out.data[rn].url] }))
								.setAuthor({ name: out.data[rn].title, url: out.data[rn].smaller_square_cover_url })
								.setImage(out.data[rn].smaller_square_cover_url)
								.setTimestamp()
								.setFooter({ text: interaction.user.username + '#' + interaction.user.discriminator });
		
							return interaction.reply({ embeds: [artEmbed] });
						}
					});
				}
			} else {
				return interaction.reply({ content: await buildText("artstation_data_error", client, { guild: interaction.guildId }), ephemeral: true })
			}
		});
    },

	data: new SlashCommandBuilder()
		.setName('art')
		.setDescription('It pulls media data from artstation.com site.')
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('category')
				.setDescription('You can select a category and bring media.')
				.setRequired(false)
				.addChoices(
					{ name: 'Fantasy', value: 'fantasy' },
					{ name: 'Architectural Visualization', value: 'archviz' },
					{ name: 'Comic Art', value: 'comic_art' },
					{ name: 'Concept Art', value: 'concept_art' },
					{ name: 'Architectural Concepts', value: 'architecture' },
					{ name: 'Character Design', value: 'character' },
					{ name: 'Creatures', value: 'creatures' },
					{ name: 'Environmental Concept Art & Design', value: 'environments' },
					{ name: 'Game Art', value: 'game_art' },
					{ name: 'Illustration', value: 'illustration' },
					{ name: 'Science Fiction', value: 'science_fiction' },
					{ name: 'Weapons', value: 'weapons' }
				))
		.addStringOption(option =>
			option.setName('search')
				.setDescription('You can search for any media you want.')
				.setRequired(false)
		)
				
}