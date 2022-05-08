const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { infoMsg } = require('../../functions/message');
const { youtube_parser } = require('../../functions/helpers');
const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'play',
    aliases: ['oynat', 'p'],
    category: 'music',
    description: 'Müzik komutu.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        try {
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
      
            const vc = message.member.voice.channel;
            if (!vc) return infoMsg(message, 'B5200', `Komutu kullanmak için ses kanalına giriş yapmalısın.`, true);

            const permissions = vc.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return infoMsg(message, 'AA5320', `Konuşmak için yetkim yok.`);
            if (!args.length) return infoMsg(message, 'AA5320', `Şarkı bağlantısı (youtube) veya şarkı ismi yazmalısın.`);

            const ytRegex = (str) => {
                var regex = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/;
                if (!regex.test(str)) {
                    return false;
                } else {
                    return true;
                }
            }
    
            const vf = async (query) => {
                let vr = "";
                if (ytRegex(args[0])) {          
                    if (await youtube_parser(args[0]) === false)  return;     
                    return await ytSearch({ videoId: await youtube_parser(args[0]) });
                } else {
                    vr = await ytSearch(query);
                    return (vr.videos.length > 1 ) ? vr.videos[0] : null;
                }
            }

            let video = "";
            if (ytRegex(args[0])) video = await vf(args[0]);
            else video = await vf(args.join(' '));
            if (video ===  null) return infoMsg(message, 'AA5320', `Belirtilen şarkı oynatılamıyor.`);

            const song = {
              title: video.title,
              url: video.url,
              timestamp: [video.duration.timestamp, (video.duration.seconds * 1000)],
              loop: false,
            };
      
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
                    const player = createAudioPlayer();
                    const subscription = connection.subscribe(player);

                    queueContruct.connection = connection;
                    queueContruct.player = player;
                    queueContruct.subscription = subscription;
                    play(message, queueContruct.songs[0]);
                } catch (err) {
                    client.log.sendError(client, err, message);
                    queue.delete(message.guild.id);
                }
            } else {
                if (message.member.voice.channelId != serverQueue.connection.joinConfig.channelId)
                    return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

                serverQueue.songs.push(song);

                const queueEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`[${song.title}](${song.url})`)
                    .setAuthor({ name: `Sıraya eklendi`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true }) })
                    .setTimestamp()
                    .setFooter({ text: message.author.username + '#' + message.author.discriminator });
            
                return serverQueue.textChannel.send({ embeds: [queueEmbed] });
            }
        } catch (error) {
            client.log.sendError(client, error, message);
        }
    }
}

async function play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
        queue.delete(guild.id);
        return;
    }

    const resource = createAudioResource(ytdl(song.url), {
        metadata: {
            title: song.title,
        }
    })
    await serverQueue.player.play(resource);
    await serverQueue.player.on(AudioPlayerStatus.Idle, () => {
        if (serverQueue.songs.length > 0) if (!serverQueue.songs[0].loop) serverQueue.songs.shift();
        play(message, serverQueue.songs[0]);
    });
    await serverQueue.player.on('error', error => {
        console.log(error);
    });

    const videoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`[${song.title}](${song.url})`)
        .setAuthor({ name: `${song.timestamp[0]} - Şu anda oynatılıyor`, iconURL: 'https://i.imgur.com/5ZbX7RV.png' })
        .setTimestamp()
        .setFooter({ text: message.author.username + '#' + message.author.discriminator });

    if (serverQueue.songs.length > 0) if (!serverQueue.songs[0].loop) serverQueue.textChannel.send({ embeds: [videoEmbed] });
}