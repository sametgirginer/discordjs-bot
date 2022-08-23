const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { getSong } = require('../../functions/voice/music');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'skip',
    category: 'music',
    description: 'music_skip_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        try {
            if (!serverQueue) return infoMsg(message, 'B5200', await buildText("music_empty_queue", client, { guild: message.guild.id }), true);
            if (serverQueue.songs.length <= 1) return infoMsg(message, 'B5200', await buildText("music_playing_empty_queue", client, { guild: message.guild.id }), true, 5000);

            if (serverQueue.player) {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', await buildText("music_member_same_vc_with_bot", client, { guild: message.guild.id }), true)

                if (serverQueue.connection) {
                    serverQueue.songs.shift();
                    serverQueue.player.play(await getSong(message, serverQueue.songs[0], true))
                }
            }

            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}