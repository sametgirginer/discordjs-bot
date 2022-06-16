const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    aliases: ['dc'],
    category: 'music',
    description: 'music_leave_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const connection = getVoiceConnection(message.guild.id);
            const queue = message.client.queue;

            if (!connection) return infoMsg(message, 'B5200', await buildText("music_bot_must_in_vc", client, { guild: message.guild.id }), true, 5000);
            if (message.member.voice.channelId != connection.joinConfig.channelId) return infoMsg(message, 'B5200', await buildText("music_member_same_vc_with_bot", client, { guild: message.guild.id }), true);
    
            queue.delete(message.guild.id);
            await connection.destroy();
            await message.react('👍');
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}