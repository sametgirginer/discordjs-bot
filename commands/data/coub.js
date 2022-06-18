const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const Coub = require('coub-dl');
const request = require('request');
const fs = require('fs');

module.exports = {
    name: 'coub',
    category: 'data',
    description: 'coub_desc',
	prefix: true,
    owner: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        message.delete();

        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(await buildText("coub_select_desc", client, { guild: message.guild.id }))
                .setAuthor({ name: 'coub.com', iconURL: 'https://i.imgur.com/ZtqG4jH.png' })

            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-video')
                    .setPlaceholder(await buildText("coub_select_category", client, { guild: message.guild.id }))
                    .addOptions([
                        {
                            label: 'Random',
                            value: 'random',
                        },
                        {
                            label: 'Anime',
                            value: 'anime',
                        },
                        {
                            label: 'Animals & Pets',
                            value: 'animals-pets',
                        },
                        {
                            label: 'Mashup',
                            value: 'mashup',
                        },
                        {
                            label: 'Movies',
                            value: 'movies',
                        },
                        {
                            label: 'Gaming',
                            value: 'gaming',
                        },
                        {
                            label: 'Cartoons',
                            value: 'cartoons',
                        },
                        {
                            label: 'Art & Design',
                            value: 'art',
                        },
                        {
                            label: 'Music',
                            value: 'music',
                        },
                        {
                            label: 'Sports',
                            value: 'sports',
                        },
                        {
                            label: 'Science & Technology',
                            value: 'science-technology',
                        },
                        {
                            label: 'Celebrity',
                            value: 'celebrity',
                        },
                        {
                            label: 'Nature & Travel',
                            value: 'nature-travel',
                        },
                        {
                            label: 'Fashion & Beauty',
                            value: 'fashion',
                        },
                        {
                            label: 'Dance',
                            value: 'dance',
                        },
                        {
                            label: 'Auto & Technique',
                            value: 'cars',
                        },
                        {
                            label: 'Blogging',
                            value: 'blogging',
                        },
                        {
                            label: 'Stand-up & Jokes',
                            value: 'standup-jokes',
                        },
                        {
                            label: 'Live Pictures',
                            value: 'live-pictures',
                        },
                        {
                            label: 'Food & Kitchen',
                            value: 'food-kitchen',
                        },
                        {
                            label: 'Memes',
                            value: 'memes',
                        }
                    ])
            );

            const sm = await message.channel.send({ embeds: [embed], components: [row] });

            const filter = i => i.user.id === message.author.id;

            const collector = message.channel.createMessageComponentCollector({ filter, time: 40000 });
            
            collector.on('collect', async i => {
                let url = `https://coub.com/api/v2/timeline/random/${i.values[0]}`;
                if (i.values[0] === "random") url = `https://coub.com/api/v2/timeline/explore/random`;
        
                request({
                    uri: url,
                    json: true,
                    jsonReplacer: true
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        url = body.coubs[0].permalink;        
                        getCoubVideo(message, url);
                        collector.stop();
                    }
                });
            });

            collector.on('end', async collected => {
                sm.delete();
            });
        } else {
            getCoubVideo(message, args[0])
        }
    }
}

async function getCoubVideo(message, url) {
    if (message && url) {
        var cooldownEmbed = new MessageEmbed()
            .setColor('#d747ed')
            .setDescription(await buildText("coub_processing_video", message.client, { guild: message.guild.id, message: message }))

        message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
            try {
                if (!fs.existsSync(`data/coub`)) fs.mkdirSync('data/coub');

                const file = `data/coub/output-${Math.ceil(Math.random() * 5000)}.mp4`;
                const coub = await Coub.fetch(url, "HIGH");

                if (coub.metadata.not_safe_for_work === true) 
                    if (message.channel.nsfw === false || message.channel.nsfw === undefined) {
                        msg.delete();
                        return infoMsg(message, 'FFE26A', await buildText("coub_nsfw_video", message.client, { guild: message.guild.id, message: message }), false, 10000);
                    }

                if (coub.duration < 5) coub.duration = 10;

                await coub.loop(10);
                await coub.attachAudio();
                await coub.addOption('-t', coub.duration);
                await coub.write(file);

                const coubVideo = new MessageAttachment(file, 'coub-video.mp4');
                const coubButton = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel(await buildText("coub_view_onsite", message.client, { guild: message.guild.id }))
                        .setURL(`https://coub.com/view/${coub.metadata.permalink}`)
                );

                return message.channel.send({ content: `<@${message.author.id}>`, files: [coubVideo], components: [coubButton], allowedMentions: { repliedUser: false } }).then(() => {
                    fs.unlinkSync(file);
                    msg.delete();
                });
            } catch (error) {
                msg.delete();
                return infoMsg(message, 'FFE26A', await buildText("coub_unvaild_url", message.client, { guild: message.guild.id, message: message }), false, 10000);   
            }
        });
    }
}