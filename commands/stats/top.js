const { MessageEmbed, MessageAttachment } = require('discord.js');
const { querySelectAll } = require('../../functions/database');
const nodeHtmlToImage = require('node-html-to-image');

module.exports = {
    name: 'top',
    category: 'stats',
    description: 'En yüksek levele ulaşan kullanıcılar.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let top = await querySelectAll(`SELECT * FROM discord_levels WHERE guild = '${message.guild.id}' ORDER BY level DESC`);
        let ttrow = "";
        let height = 60;
        let sira = 1;

        top.forEach(data => {
            ttrow += `
            <tr class="user">
                <td class="id">#${sira}</td>
                <td class="name">${message.guild.members.cache.find(m => m.id === data.user).user.username}</td>
                <td class="level">Level ${data.level}</td>
                <td class="xp">XP ${data.xp}</td>
            </tr>`;

            //ttrow += `${sira}. ${message.guild.members.cache.find(m => m.id === data.user).user.username} - Level: ${data.level} - XP: ${data.xp}\n`;
            sira++;
            height += 20;
            if (sira > 10) return;
        });

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
				.setFooter(message.author.username + '#' + message.author.discriminator);

			return message.channel.send(toptenEmbed);
        }
    }
}