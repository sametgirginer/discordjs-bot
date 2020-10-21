const { MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const request = require("request");
const kategoriler = '`kurgu, 3d, komik, konsept, mimari, karakter, yaratık, manzara, oyun, çizim, mekanik, bilim, hayal, silah`';

module.exports = {
    name: 'art',
    category: 'data',
    description: 'artstation.com sitesinden veri çeker.',
	prefix: true,
    owner: false,
    onlykeyubu: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		let randomUrl = 'https://www.artstation.com/random_project.json?&category=';

		if (args.length) {
			let kategori;

			if (args[0] == 'fantasy' || args[0] == 'fantazi' || args[0] == 'kurgu' || args[0] == 'hayal') kategori = 'fantasy';
			if (args[0] == 'archviz' || args[0] == '3d') kategori = 'archviz';
			if (args[0] == 'comic' || args[0] == 'komik') kategori = 'comic_art';
			if (args[0] == 'concept' || args[0] == 'konsept') kategori = 'concept_art';
			if (args[0] == 'architecture' || args[0] == 'mimari' || args[0] == 'yapı' || args[0] == 'inşaat') kategori = 'architecture';
			if (args[0] == 'character' || args[0] == 'char' || args[0] == 'karakter' || args[0] == 'reel') kategori = 'characters';
			if (args[0] == 'creature' || args[0] == 'yaratık' || args[0] == 'varlık') kategori = 'creatures';
			if (args[0] == 'environment' || args[0] == 'manzara' || args[0] == 'çevre' || args[0] == 'cevre' || args[0] == 'ortam') kategori = 'environments';
			if (args[0] == 'game' || args[0] == 'oyun') kategori = 'game_art';
			if (args[0] == 'illustration' || args[0] == 'ill' || args[0] == 'çizim') kategori = 'illustration';
			if (args[0] == 'mecha' || args[0] == 'meka' || args[0] == 'mekanik') kategori = 'mecha';
			if (args[0] == 'science' || args[0] == 'bilim' || args[0] == 'scfi') kategori = 'science_fiction';
			if (args[0] == 'surreal' || args[0] == 'sürreal' || args[0] == 'hayal' || args[0] == 'hayali') kategori = 'surreal';
			if (args[0] == 'weapon' || args[0] == 'silah') kategori = 'weapons';

			if (kategori == '' || kategori == null) return infoMsg(message, '65bff0', `<@${message.author.id}>, geçerli bir kategori ismi girmelisin.\nKategoriler: ${kategoriler}`, true, 15000);
			else randomUrl += kategori;
		}

		request({
			url: randomUrl,
			json: true,
			jsonReplacer: true
		}, function(err, response, body) {
			if (!err && response.statusCode === 200) {
				let out = JSON.parse(JSON.stringify(body));
				let title = out.title.toString();
				let usrUrl = 'Profil: https://artstation.com/' + out.user.username.toString();
				let viewCount = out.views_count.toString();
				let likeCount = out.likes_count.toString();
				let image = out.cover.large_image_url.toString();

				const artEmbed = new MessageEmbed()
				    .setColor('#' + (Math.random()*0xFFFFFF<<0).toString(16))
				    .setDescription(usrUrl)
				    .setAuthor(title, image.embedAvatar)
				    .addField('Görüntülenme', viewCount, true)
				    .addField('Beğeni', likeCount, true)
				    .setImage(image)
				    .setTimestamp()
				    .setFooter(message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.');

                message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
				return message.channel.send(artEmbed);
			} else {
                message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
				return infoMsg(message, 'B20000', `<@${message.author.id}>, veri çekme işleminde bir hata oluştu.`, true, 10000)
			}
		});
    }
}