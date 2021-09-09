const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'durum',
    category: 'info',
    description: 'Bot durum bilgisini gösterir.',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		const promises = [
			await client.shard.fetchClientValues('guilds.cache.size'),
			await client.shard.broadcastEval(client => client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
		];

		return Promise.all(promises).then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

			return infoMsg(message, '65bff0', `Sunucu Sayısı: **${totalGuilds}**\nKullanıcı Sayısı: **${totalMembers}**`, false, 0, [true, false])
		}).catch(console.error);
    }
}