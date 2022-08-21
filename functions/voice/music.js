const ytdl = require('ytdl-core');
const auth = require('../authorization');
const { EmbedBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const { msToMinutesAndSeconds } = require('../../functions/helpers');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    play: async function(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);
    
        if (!song) {
            queue.delete(guild.id);
            return;
        }
    
        const resource = createAudioResource(
            ytdl(song.url, { 
                filter: "audioonly",
                fmt: "mp3",
                highWaterMark: 1 << 62,
                liveBuffer: 1 << 62,
                dlChunkSize: 0,
                bitrate: 128,
                quality: "highestaudio"
            }), {
            metadata: {
                title: song.title,
            }
        });

        await serverQueue.player.play(resource);
        await serverQueue.player.on(AudioPlayerStatus.Idle, () => {
            if (serverQueue.songs.length > 0) if (!serverQueue.songs[0].loop) serverQueue.songs.shift();
            module.exports.play(message, serverQueue.songs[0]);
        });

        await serverQueue.player.on('error', error => {
            message.client.log.sendError(message.client, error, message);
        });
    
        const videoEmbed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`[${song.title}](${(song.spotifyURL) ? song.spotifyURL : song.url})`)
            .setAuthor({ name: await buildText("music_playing", message.client, { guild: message.guild.id, variables: [song.timestamp[0]] }), iconURL: 'https://i.imgur.com/5ZbX7RV.png' })
            .setTimestamp()
            .setFooter({ text: message.author.username + '#' + message.author.discriminator });
    
        if (serverQueue.songs.length > 0) if (!serverQueue.songs[0].loop) serverQueue.textChannel.send({ embeds: [videoEmbed] });
    },

    getSpotifyTrack: async function (url) {
        var regex = /https:\/\/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]{15,})/;
        var match = url.match(regex);
        var category = match[1];
        var id = match[2];

        if (category === "track") {
            const data = await auth.spotify(`https://api.spotify.com/v1/tracks/${id}`);
            const track = {
                title: `${data.artists[0].name} - ${data.name}`,
                url: data.external_urls.spotify,
            }
            return track;
        } else if (category === "album") {
            const data = await auth.spotify(`https://api.spotify.com/v1/albums/${id}`);
            const tracks = [];
            data.tracks.items.forEach(item => {
                tracks.push({
                    title: `${item.artists[0].name} - ${item.name}`,
                    url: item.external_urls.spotify,
                });
            });
            return tracks;
        } else if (category === "playlist") {
            const data = await auth.spotify(`https://api.spotify.com/v1/playlists/${id}`);
            const tracks = [];
            data.tracks.items.forEach(item => {
                if (item.track) {
                    tracks.push({
                        title: `${item.track.artists[0].name} - ${item.track.name}`,
                        url: item.track.external_urls.spotify,
                    });
                }
            });
            return tracks;
        } else {
            return false;
        }
    },
}