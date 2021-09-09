const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const request = require("request");
const kategoriler = '`fantasy, archviz, comicart, konsept, mimari, karakter, yaratık, manzara, oyun, ill, mecha, scfi, sürreal, silah`';

module.exports = {
    name: 'art',
    category: 'data',
    description: `Random veri için ${process.env.prefix}art\n\nKategoriden random veri için: ${process.env.prefix}art kategori [${kategoriler}]\n\nArama yapmak için: ${process.env.prefix}art [xxx]`,
	prefix: true,
    owner: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {	
		let apiUrl = "https://www.artstation.com/random_project.json?&category=";
		let query = "";

		if (args[0] === "kategori" || args[0] === "category") {
			let kategori;

			if (args[1] == 'fantasy') kategori = 'fantasy';
			if (args[1] == 'archviz') kategori = 'archviz';
			if (args[1] == 'comicart') kategori = 'comic_art';
			if (args[1] == 'concept' || args[1] == 'konsept') kategori = 'concept_art';
			if (args[1] == 'architecture' || args[1] == 'mimari' || args[1] == 'yapı') kategori = 'architecture';
			if (args[1] == 'character' || args[1] == 'char' || args[1] == 'karakter') kategori = 'character';
			if (args[1] == 'creature' || args[1] == 'yaratık') kategori = 'creatures';
			if (args[1] == 'environment' || args[1] == 'manzara' || args[1] == 'çevre') kategori = 'environments';
			if (args[1] == 'game' || args[1] == 'oyun') kategori = 'game_art';
			if (args[1] == 'illustration' || args[1] == 'ill' || args[1] == 'çizim') kategori = 'illustration';
			if (args[1] == 'mecha') kategori = 'mecha';
			if (args[1] == 'science' || args[1] == 'scfi') kategori = 'science_fiction';
			if (args[1] == 'surreal' || args[1] == 'sürreal') kategori = 'surreal';
			if (args[1] == 'weapon' || args[1] == 'silah') kategori = 'weapons';

			if (kategori == '' || kategori == null) return infoMsg(message, '65bff0', `<@${message.author.id}>, geçerli bir kategori ismi girmelisin.\n\nKategoriler: ${kategoriler}`, true);
			else apiUrl = `https://www.artstation.com/random_project.json?&category=${kategori}`;
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
						.setDescription(`Tarayıcıda görüntülemek için [buraya](${out.permalink}) tıklayın.`)
						.setAuthor(out.title, out.user.medium_avatar_url)
						.addFields([
							{ name: 'Görüntülenme', value: (out.views_count).toString(), inline: true },
							{ name: 'Beğeni', value: (out.likes_count).toString(), inline: true },
							{ name: 'Yorum', value: (out.comments_count).toString(), inline: true }
						])
						.setImage(out.cover.large_image_url)
						.setTimestamp()
						.setFooter(message.author.username + '#' + message.author.discriminator);

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
							if (out.total_count === 0) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, ${query} araması ile ilgili veri yok.`, true, 10000);
		
							if (out.data[rn].hide_as_adult === true)
								if (message.channel.nsfw === false || message.channel.nsfw === undefined)
									return infoMsg(message, 'FFE26A', `<@${message.author.id}>, bu resim sadece nsfw paylaşımına izin verilen kanala gönderilebilir.`, true, 10000);
						
							const artEmbed = new MessageEmbed()
								.setColor('RANDOM')
								.setDescription(`**${query}** araması ile ilgili **${(out.total_count-1 === 0) ? 1 : out.total_count-1}** sonuç bulundu.\nTarayıcıda görüntülemek için [buraya](${out.data[rn].url}) tıklayın.\n\nArama fonksiyonu yapım aşamasındadır.`)
								.setAuthor(out.data[rn].title, out.data[rn].smaller_square_cover_url)
								.setImage(out.data[rn].smaller_square_cover_url)
								.setTimestamp()
								.setFooter(message.author.username + '#' + message.author.discriminator);
		
							message.delete();
							return message.channel.send({ embeds: [artEmbed] });
						}
					});
				}
			} else {
				return infoMsg(message, 'B20000', `<@${message.author.id}>, veri çekme işleminde bir hata oluştu.`, true, 10000)
			}
		});
    }
}