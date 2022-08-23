const ytSearch = require('yt-search');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { youtube_parser } = require('../../functions/helpers');
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const { play, getSpotifyTrack } = require('../../functions/voice/music');
const spotify = (process.env.spotifyclientid.length > 0 && process.env.spotifyclientsecret.length > 0) ? true : false;

module.exports = {
    name: 'play',
    aliases: ['p'],
    category: 'music',
    description: 'music_play_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        try {
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
      
            const vc = message.member.voice.channel;
            if (!vc) return infoMsg(message, 'B5200', await buildText("music_member_must_connect_vc", client, { guild: message.guild.id }), true);
            if (!args.length) return infoMsg(message, 'AA5320', await buildText("music_required_query", client, { guild: message.guild.id }));

            const permissions = vc.permissionsFor(message.client.user);
            if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak) || !permissions.has(PermissionFlagsBits.ViewChannel))
                return infoMsg(message, 'AA5320', await buildText("music_permission_required", client, { guild: message.guild.id }));

            const regexSwitch = (str) => {
                var youtubeRegex = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/;
                var spotifyRegex = /(https:\/\/open\.spotify\.com\/(track|album|playlist)\/)([a-zA-Z0-9]{15,})/;

                if (youtubeRegex.test(str)) return "youtube_url";
                else if (spotify && spotifyRegex.test(str)) return "spotify_url";
                else return false;
            }
    
            const vf = async (query) => {
                let vr = "";
                let rr = regexSwitch(args[0]);
                if (rr === "youtube_url") {          
                    if (await youtube_parser(args[0]) === false)  return;     
                    return await ytSearch({ videoId: await youtube_parser(args[0]) });
                } else if (rr === "spotify_url") {
                    query = await getSpotifyTrack(args[0]);
                    if (!query) return null;
                    if (query.length) return query;
                    vr = await ytSearch(query.title);
                    vr = (vr.videos.length > 1 ) ? vr.videos[0] : null;
                    vr.title = query.title;
                    vr.spotifyURL = query.url;
                    return vr;
                } else {
                    vr = await ytSearch(query);
                    return (vr.videos.length > 1 ) ? vr.videos[0] : null;
                }
            }

            let video = "";
            let pltracks = [];
            if (regexSwitch(args[0])) video = await vf(args[0]);
            else video = await vf(args.join(' '));
            if (video === null) return infoMsg(message, 'AA5320', await buildText("music_cannot_played", client, { guild: message.guild.id }));

            if (video.length) {
                pltracks = video;
                vr = await ytSearch(video[0].title);
                vr = (vr.videos.length > 1 ) ? vr.videos[0] : null;
                if (vr) vr.spotifyURL = video[0].url;
                video = vr;
            }

            const song = {
              title: video.title,
              url: video.url,
              timestamp: [video.duration.timestamp, (video.duration.seconds * 1000)],
              loop: false,
              spotifyURL: (video.spotifyURL) ? video.spotifyURL : false,
            };

            const addQueueSongs = async (songs, queue) => {
                if (queue) {
                    let songsLength = 0;
                    songs.forEach(async song => {
                        const track = {
                            title: song.title,
                            url: song.url,
                            loop: false,
                            spotifyURL: song.url,
                        };
                        queue.songs.push(track);

                        ++songsLength;
                        if (songsLength === songs.length) {
                            const queueEmbed = new EmbedBuilder()
                                .setColor('Random')
                                .setDescription(await buildText("music_playlist_added_queue_desc", client, { guild: message.guild.id }))
                                .setAuthor({ name: await buildText("music_playlist_added_queue", client, { guild: message.guild.id }), iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
                                .setTimestamp()
                                .setFooter({ text: message.author.username + '#' + message.author.discriminator });
                        
                            return queue.textChannel.send({ embeds: [queueEmbed] });
                        }
                    });
                }
            }
      
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    vc: vc,
                    connection: null,
                    player: null,
                    subscription: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                    loop: false,
                };
      
                queue.set(message.guild.id, queueContruct);
                queueContruct.songs.push(song);
                
                try {
                    const connection = joinVoiceChannel({
                        channelId: message.member.voice.channelId,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                    });
                    
                    const player = createAudioPlayer({ debug: true });
                    const subscription = connection.subscribe(player);

                    queueContruct.connection = connection;
                    queueContruct.player = player;
                    queueContruct.subscription = subscription;

                    play(message, queueContruct.songs[0]);
                    if (pltracks.length) {
                        pltracks.shift();
                        addQueueSongs(pltracks, queueContruct);
                    }
                } catch (err) {
                    client.log.sendError(client, err, message);
                    queue.delete(message.guild.id);
                }
            } else {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId)
                    return infoMsg(message, 'B5200', await buildText("music_member_same_vc_with_bot", client, { guild: message.guild.id }), true);

                if (pltracks.length) {
                    addQueueSongs(pltracks, serverQueue);
                } else {
                    serverQueue.songs.push(song);

                    const queueEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`[${song.title}](${song.url})`)
                        .setAuthor({ name: await buildText("music_added_queue", client, { guild: message.guild.id }), iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
                        .setTimestamp()
                        .setFooter({ text: message.author.username + '#' + message.author.discriminator });
                
                    return serverQueue.textChannel.send({ embeds: [queueEmbed] });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}