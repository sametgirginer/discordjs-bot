const Canvas = require('canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

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
		if (!args.length) return infoMsg(message, 'RANDOM', `**${process.env.prefix}kaşar** <kim kaşar>`, true, 5000);

		let yazi = "";
		
		if (args.length > 1) {
			for	(i = 0; i < args.length; i++) {
				yazi += args[i] + ' ';
			}
		} else if (args.length == 1) {
			yazi = args[0];
		}

		if (yazi.length < 3) return infoMsg(message, 'RANDOM', await buildText("kasar_min", client, { guild: message.guild.id }), true, 5000);
		if (yazi.length > 16) return infoMsg(message, 'RANDOM', await buildText("kasar_max", client, { guild: message.guild.id }), true, 5000);

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
			.setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

		message.reply({ embeds: [embed], files: [attachment], allowedMentions: { repliedUser: false } });
	},
};