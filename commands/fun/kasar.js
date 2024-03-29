const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const Canvas = require('canvas');

module.exports = {
    run: async (client, interaction) => {
		let text = interaction.options.getString('text');
		if (!text) return interaction.reply({ content: await buildText("interaction_required_args", client, { guild: interaction.guildId }), ephemeral: true });

		if (text.length < 3) return interaction.reply({ content: await buildText("kasar_min", client, { guild: interaction.guildId }), ephemeral: true });
		if (text.length > 16) return interaction.reply({ content: await buildText("kasar_max", client, { guild: interaction.guildId }), ephemeral: true });

		const canvas = Canvas.createCanvas(590, 440);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('data/peynir.png');

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		
		ctx.font = '46px sans-serif';
		ctx.fillStyle = '#197531';
		ctx.fillText(`${text}`, canvas.width / 12, canvas.height / 3);
		
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		
		const attachment = new AttachmentBuilder()
			.setFile(canvas.toBuffer())
			.setName('kasar.png')

		return interaction.reply({ files: [attachment], allowedMentions: { repliedUser: false } });
	},

	data: new SlashCommandBuilder()
		.setName('kaşar')
		.setDescription('Just the "kaşar" command')
		.setDMPermission(true)
		.addStringOption(option =>
			option.setName('text')
				.setDescription('The "kaşar" command to be entered for the text')
				.setRequired(true))
};