const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const request = require("request");
const categories = ['fantasy', 'archviz', 'comic_art', 'concept_art', 'architecture', 'character', 'creatures', 'environments', 'game_art', 'illustration', 'mecha', 'science_fiction', 'surreal', 'weapons']

module.exports = {
    name: 'art',
    category: 'data',
    description: `artstation_desc`,
	prefix: true,
    owner: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {	
		let apiUrl = "https://www.artstation.com/random_project.json?&category=";
		let query = "";

		if (args[0] === "kategori" || args[0] === "category") {
			let category = null;

			categories.forEach(c => {
				if (c == args[1]) category = c;
			});

			if (category == null) return infoMsg(message, '65bff0', await buildText("artstation_select_category", client, { guild: message.guild.id, message: message }), true);
			else apiUrl = `https://www.artstation.com/random_project.json?&category=${category}`;
		} else if (args.length) {
			args.forEach(arg => {
				query += `${arg}${(args.length > 1) ? " " : ""}`;
			});
			apiUrl = `https://www.artstation.com/api/v2/search/projects.json?query="${query}"&page=1&per_page=75`;
		}

		request({
			url: apiUrl,
			json: true,
			jsonReplacer: true
		}, async function(err, response, body) {
			if (!err && response.statusCode === 200) {
				let out = JSON.parse(JSON.stringify(await body));

				if (out.id != undefined) {
					const artEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setDescription(await buildText("artstation_click_here", client, { guild: message.guild.id, variables: [out.permalink] }))
						.setAuthor({ name: out.title, url: out.user.medium_avatar_url })
						.addFields([
							{ name: await buildText("artstation_views", client, { guild: message.guild.id }), value: (out.views_count).toString(), inline: true },
							{ name: await buildText("artstation_likes", client, { guild: message.guild.id }), value: (out.likes_count).toString(), inline: true },
							{ name: await buildText("artstation_comments", client, { guild: message.guild.id }), value: (out.comments_count).toString(), inline: true }
						])
						.setImage(out.cover.large_image_url)
						.setTimestamp()
						.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

					message.delete();
					return message.channel.send({ embeds: [artEmbed] });
				} else {
					let page = Math.floor(Math.random() * (((out.total_count / 75) === 0) ? 1 : Math.floor(out.total_count / 75)) + 1);
					apiUrl = `https://www.artstation.com/api/v2/search/projects.json?query="${query}"&page=${page}&per_page=75`;

					request({
						url: apiUrl,
						json: true,
						jsonReplacer: true
					}, async function(err, response, body) {
						if (!err && response.statusCode === 200) {
							out = JSON.parse(JSON.stringify(await body));

							let rn = Math.floor((Math.random() * 1) * Math.floor((out.total_count < 75) ? out.total_count-1 : 74));
							if (out.total_count === 0) return infoMsg(message, 'FFE26A', await buildText("artstation_not_found", client, { guild: message.guild.id, message: message, variables: [query] }), true, 10000);
		
							if (out.data[rn].hide_as_adult === true)
								if (message.channel.nsfw === false || message.channel.nsfw === undefined)
									return infoMsg(message, 'FFE26A', await buildText("artstation_nsfw_content", client, { guild: message.guild.id, message: message }), true, 10000);
						
							out.total_count = (out.total_count-1 === 0) ? 1 : out.total_count - 1;
							const artEmbed = new MessageEmbed()
								.setColor('RANDOM')
								.setDescription(await buildText("artstation_search_found", client, { guild: message.guild.id, variables: [query, out.total_count, out.data[rn].url] }))
								.setAuthor({ name: out.data[rn].title, url: out.data[rn].smaller_square_cover_url })
								.setImage(out.data[rn].smaller_square_cover_url)
								.setTimestamp()
								.setFooter({ text: message.author.username + '#' + message.author.discriminator });
		
							message.delete();
							return message.channel.send({ embeds: [artEmbed] });
						}
					});
				}
			} else {
				return infoMsg(message, 'B20000', await buildText("artstation_data_error", client, { guild: message.guild.id, message: message }), true, 10000)
			}
		});
    }
}