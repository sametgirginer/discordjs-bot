const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'stats',
	aliases: ['durum'],
    category: 'info',
    description: 'stats_desc',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
		const promises = [
			await client.shard.fetchClientValues('guilds.cache.size'),
			await client.shard.broadcastEval(client => client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
		];

		return Promise.all(promises).then(async results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

			return infoMsg(message, '65bff0', await buildText("stats_results", client, { guild: message.guild.id, variables: [totalGuilds, totalMembers] }), false, 0, [true, false])
		}).catch(console.error);
    }
}