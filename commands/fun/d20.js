const { PermissionFlagsBits } = require('discord.js');
const { buildText } = require('../../functions/language.js');
const { infoMsg } = require('../../functions/message.js');

module.exports = {
	name: 'd20',
	aliases: ['d!20',],
    category: 'info',
    description: 'dice_desc',
	prefix: false,
	owner: false,
	supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
		let maxdice = 5;
		let argdice = (args[0]) ? args[0] : 1;
		let dice = "";

		if (argdice > maxdice) return infoMsg(message, 'Random', await buildText("dice_max", client, { guild: message.guild.id, message: message, variables: [maxdice] }), true, 3000);
		
		if (argdice > 1) {
			for (let i = 0; i < argdice; i++) {
				dice += `:game_die: [**20**]\t\t→\t\t**${Math.ceil(Math.random() * 20)}**\n`;
			}
		} else {
			dice = `:game_die: [**20**]\t\t→\t\t**${Math.ceil(Math.random() * 20)}**`;
		}
		
        return message.reply({ content: await buildText("dice_result", client, { guild: message.guild.id, message: message, variables: [argdice, dice] }), allowedMentions: { repliedUser: false } });
	},
};