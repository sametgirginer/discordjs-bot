const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { DiscordTogether } = require('discord-together');

module.exports = {
    name: 'youtube',
    category: 'game',
    description: 'youtube_desc',
    prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return infoMsg(message, 'B5200', await buildText("must_login_voice", client, { guild: message.guild.id }), true);

        client.discordTogether = new DiscordTogether(client);
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
            return message.channel.send(`${invite.code}`);
        });

    }
}