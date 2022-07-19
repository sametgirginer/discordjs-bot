const { AudioPlayerStatus } = require('@discordjs/voice');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'loop',
    category: 'music',
    description: 'music_loop_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            if (!serverQueue) return infoMsg(message, 'B5200', await buildText("music_not_playing", client, { guild: message.guild.id }), true);
            if (message.member.voice.channelId  != serverQueue.connection.joinConfig.channelId) return infoMsg(message, 'B5200', await buildText("music_member_same_vc_with_bot", client, { guild: message.guild.id }), true);

            if (serverQueue.player._state.status == "playing") {
                if (serverQueue.songs[0].loop) { 
                    serverQueue.songs[0].loop = false;
                    message.react('❌');
                } else {
                    serverQueue.songs[0].loop = true;
                    message.react('👍');
                }
            }

        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}