const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { infoMsg } = require('../../functions/message');
const { youtube_parser } = require('../../functions/helpers');
const { MessageEmbed } = require('discord.js');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

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
                    songs: [],
                    volume: 5,
                    playing: true,
                    loop: false,
                };
      
                queue.set(message.guild.id, queueContruct);
                queueContruct.songs.push(song);
                
                try {
                    var connection = await vc.join();
                    queueContruct.connection = connection;
                    play(message, queueContruct.songs[0]);
                } catch (err) {
                    client.log.sendError(client, err, message);
                    queue.delete(message.guild.id);
                }
            } else {
                if (message.member.voice.channel.id != serverQueue.connection.channel.id)
                    return infoMsg(message, 'B5200', `Bu işlemi yapmak için botun aktif olarak bulunduğu ses kanalına bağlanmalısın.`, true);

                serverQueue.songs.push(song);

                const queueEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`[${song.title}](${song.url})`)
                    .setAuthor(`Sıraya eklendi`, message.author.avatarURL({ format: 'png', dynamic: true }))
                    .setTimestamp()
                    .setFooter(message.author.username + '#' + message.author.discriminator);
            
                return serverQueue.textChannel.send(queueEmbed);
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
        //serverQueue.vc.leave();
        queue.delete(guild.id);
        return;
    }
  
    const dispatcher = await serverQueue.connection
        .play(ytdl(song.url), { quality: 'highestaudio' })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    const videoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`[${song.title}](${song.url})`)
        .setAuthor(`${song.timestamp[0]} - Şu anda oynatılıyor`, 'https://i.imgur.com/5ZbX7RV.png')
        .setTimestamp()
        .setFooter(message.author.username + '#' + message.author.discriminator);

    serverQueue.textChannel.send(videoEmbed);
}