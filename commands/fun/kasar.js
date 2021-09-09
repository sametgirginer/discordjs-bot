const Canvas = require('canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');

module.exports = {
	name: 'kasar',
	aliases: ['kaşar',],
    category: 'info',
    description: 'Kaşar peynir',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		if (!args.length) return infoMsg(message, 'RANDOM', `kaşar komutunun kullanımı: **${process.env.prefix}kasar** __mokokoya__`, true, 10000);

		yazi = '';
		if (args.length >= 2) {
			for	(i = 0; i < args.length; i++) {
				yazi += args[i] + ' ';
			}

			if (yazi.length < 4) return infoMsg(message, 'RANDOM', '**kaşar** komutunu kullanabilmek için __en az 4__ harf girmelisin.', true, 10000);
			if (yazi.length > 16) return infoMsg(message, 'RANDOM', '**kaşar** komutunu kullanabilmek  için __en fazla 16__ harf girebilirsin.', true, 10000);
		} else if (args.length == 1) {
			yazi = args;

			if (args[0].length < 4) return infoMsg(message, 'RANDOM', '**kaşar** komutunu kullanabilmek  için __en az 4__ harf girmelisin.', true, 10000);
			if (args[0].length > 16) return infoMsg(message, 'RANDOM', '**kaşar** komutunu kullanabilmek  için __en fazla 16__ harf girebilirsin.', true, 10000);
		}

		const canvas = Canvas.createCanvas(590, 440);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('data/peynir.png');

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		
		ctx.font = '46px sans-serif';
		ctx.fillStyle = '#197531';
		ctx.fillText(`${yazi}`, canvas.width / 12, canvas.height / 3);
		
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		
		const attachment = new MessageAttachment(canvas.toBuffer(), 'kasar.png');

		const embed = new MessageEmbed()
			.setColor('#65c936')
			.setImage('attachment://kasar.png')
			.setTimestamp()
			.setFooter(message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.');

		message.reply({ embeds: [embed], files: [attachment], allowedMentions: { repliedUser: false } });
	},
};