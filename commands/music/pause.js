const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'pause',
    aliases: ['unpause'],
    category: 'music',
    description: 'music_pause_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        try {
            if (!serverQueue) return infoMsg(message, 'B5200', await buildText("music_not_playing", client, { guild: message.guild.id }), true);

            if (serverQueue.player) {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', await buildText("music_member_same_vc_with_bot", client, { guild: message.guild.id }), true)

                if (serverQueue.player._state.status === "playing") {
                    await serverQueue.player.pause();
                    message.react('⏸️');
                } else if (serverQueue.player._state.status === "paused") {
                    await serverQueue.player.unpause();
                    message.react('▶️');
                }
            }

        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}