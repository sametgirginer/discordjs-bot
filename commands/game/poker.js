const { infoMsg } = require('../../functions/message');
const { DiscordTogether } = require('discord-together');

module.exports = {
    name: 'poker',
    category: 'game',
    description: 'Poker oyunu başlatır.',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return infoMsg(message, 'B5200', `Komutu kullanmak için ses kanalına giriş yapmalısın.`, true);

        client.discordTogether = new DiscordTogether(client);
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
            return message.channel.send(`${invite.code}`);
        });

    }
}