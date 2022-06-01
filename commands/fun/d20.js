const { buildText } = require('../../functions/language.js');
const { infoMsg } = require('../../functions/message.js');

module.exports = {
	name: 'd20',
	aliases: ['d!20',],
    category: 'info',
    description: 'd20_desc',
	prefix: false,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		let d20 = 0;
		
		if (args[0] > 3) return infoMsg(message, `RANDOM`, await buildText("d20_maxdice", client, { guild: message.guild.id, message: message }), true, 3000);
		
		if (args[0] == '2') {
			d20 = Math.ceil(Math.random() * 20);
			d20 += ' | ' + Math.ceil(Math.random() * 20);
		} else if (args[0] == '3') {
			d20 = Math.ceil(Math.random() * 20);
			d20 += ' | ' + Math.ceil(Math.random() * 20);
			d20 += ' | ' + Math.ceil(Math.random() * 20);
		} else {
			d20 = Math.ceil(Math.random() * 20);
		}

        return message.reply({ content: `d20 » **${d20}**`, allowedMentions: { repliedUser: false } });
	},
};