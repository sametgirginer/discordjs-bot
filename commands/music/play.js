const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { infoMsg } = require('../../functions/message');
const { MessageEmbed } = require('discord.js');

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
            if (!vc) return infoMsg(message, 'B5200', `Komutu kullanmak için ses kanalına giriş yapmalısın.`, true)

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
                    if (youtube_parser(args[0]) === false)  return;     
                    return await ytSearch({ videoId: youtube_parser(args[0]) });
                } else {
                    vr = await ytSearch(query);
                    return (vr.videos.length > 1 ) ? vr.videos[0] : null;
                }
            }

            let video = "";
            if (ytRegex(args[0])) video = await vf(args[0]);
            else video = await vf(args.join(' '));

            const song = {
              title: video.title,
              url: video.url,
              timestamp: video.duration.timestamp,
              ago: video.ago,
              thumbnail: video.thumbnail,
              views: video.views
            };
      
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    vc: vc,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
      
                queue.set(message.guild.id, queueContruct);
                queueContruct.songs.push(song);
                
                try {
                    var connection = await vc.join();
                    queueContruct.connection = connection;
                    play(message, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                }
            } else {
                serverQueue.songs.push(song);
                return infoMsg(message, 'RANDOM', `**${song.title}** sıraya eklendi!`)
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
  
    if (!song) {
        serverQueue.vc.leave();
        queue.delete(guild.id);
        return;
    }
  
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    const videoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`Tarayıcıda görüntülemek için [buraya](${song.url}) tıklayın.`)
        .setAuthor(song.title, song.thumbnail)
        .addField('Süre', song.timestamp, true)
        .addField('Görüntülenme', song.views, true)
        .addField('Yükleme Tarihi', song.ago, true)
        .setTimestamp()
        .setFooter(message.author.username + '#' + message.author.discriminator);

    serverQueue.textChannel.send(videoEmbed);
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}