const { MessageEmbed, MessageAttachment } = require('discord.js');
const { querySelectAll } = require('../../functions/database');
const { infoMsg } = require('../../functions/message');
const nodeHtmlToImage = require('node-html-to-image');

module.exports = {
    name: 'top',
    category: 'stats',
    description: 'Discord sunucusunun level sıralaması.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let top = await querySelectAll(`SELECT * FROM discord_levels WHERE guild = '${message.guild.id}' ORDER BY xp DESC`);
        let ttrow = "";
        let height = 60;
        let i = 0;
        let liste = 10;

        if (args[0]) {
            i = parseInt((args[0] + "0"));
            liste = parseInt((args[0] + "0")) + 10;

            if (i > top.length) {
                return infoMsg(message, 'RANDOM', `Liste boş olduğu için işlem yapılamadı.`, true, 5000);
            }
        } 
        
        for (i; i < top.length; i++) {
			let user = top[i].user;
			if (message.guild.members.cache.find(m => m.id === top[i].user) != undefined) {
				user = message.guild.members.cache.find(m => m.id === top[i].user).user.username;
			}

            sira = i + 1;

            ttrow += `
            <tr class="user">
                <td class="id">#${sira}</td>
                <td class="name">${user}</td>
                <td class="level">Level ${top[i].level}</td>
                <td class="xp">XP ${top[i].xp}</td>
            </tr>`;

            height += 20;
			if (i > liste) {
				height = 380;
				break;
			}
        }

        let html_topten = `
            <html>
                <style>
                    html, body {
                        background: transparent;
                        width: 500px;
                        height: ${height}px;
                    }
                
                    table {
                        width: 100%;
                        padding: 5px;
                        border-spacing: 0 7px;
                    }
                
                    .user {
                        background: #efefee;
                        color: #000;
                    }
                
                    .user .name {
                        width: 200px;
                    }
                
                    td:first-child {
                        padding-left: 20px;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        border-radius: 10px 0 0 10px;
                        
                    }
                
                    td:last-child {
                        padding-right: 20px;
                        border-radius: 0 10px 10px 0;
                    }
                </style>
                <body><table><tbody>${ttrow}</tbody></table></body>
            </html>`;

        await nodeHtmlToImage({
            html: html_topten,
            transparent: true,
            output: `./commands/stats/cache/${message.guild.id}_topten.png`
        });

        if (ttrow) {	
			const image = new MessageAttachment(`./commands/stats/cache/${message.guild.id}_topten.png`, 'top10.png');

			const toptenEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${message.guild.name} TOP 10`)
				.attachFiles(image)
				.setImage('attachment://top10.png')
				.setTimestamp()
				.setFooter(`Sonraki liste için ${process.env.prefix}${(args[0] === undefined) ? "top" : "top " + (parseInt(args[0])+1)} / ${message.author.username}#${message.author.discriminator}`);

			return message.channel.send(toptenEmbed);
        }
    }
}