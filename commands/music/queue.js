const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const { infoMsg } = require('../../functions/message');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'music',
    description: 'music_queue_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        const queue = client.queue.get(message.guild.id);
        if (!queue) return infoMsg(message, 'B5200', await buildText("music_no_queue", client, { guild: message.guild.id }), true, 5000);
        if (queue.songs.length <= 1) return infoMsg(message, 'B5200', await buildText("music_playing_empty_queue", client, { guild: message.guild.id }), true, 5000);

        let list = [];
        let listNumber = 0;
        let songs = queue.songs;
        let currentSong = queue.songs[0];
        let currentSongURL = (currentSong.spotifyURL) ? currentSong.spotifyURL : currentSong.url;
        let currentSongText = await buildText("music_current_song", client, { guild: message.guild.id });

        for (let i = 1; i < songs.length; i++) {
            if (list[`${listNumber}`] === undefined && listNumber === 0) list[`${listNumber}`] = `**${currentSongText} __[${currentSong.title}](${currentSongURL})__**\n\n`;
            else if (list[`${listNumber}`] === undefined) list[`${listNumber}`] = "";

            list[`${listNumber}`] += `${i}. [${songs[i].title}](${songs[i].url})\n`;

            if (list[`${listNumber}`].length >= 1800) listNumber++;
        }

        if (list.length) {
            list.forEach(l => {
                const queueEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(l)

                queue.textChannel.send({ embeds: [queueEmbed] });
            });
        }
    },
}