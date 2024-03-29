const { EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const { querySelectAll } = require('../../functions/database');
const { buildText } = require('../../functions/language');
const { infoMsg } = require('../../functions/message');
const nodeHtmlToImage = require('node-html-to-image');
const search = require('../../functions/search');
const fs = require('fs');

module.exports = {
    name: 'top',
    category: 'stats',
    description: 'top_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        let top = await querySelectAll(`SELECT * FROM discord_levels WHERE guild = '${message.guild.id}' ORDER BY xp DESC`);
        let ttrow = [];

        if (!args[0]) listeLength = 1; else listeLength = args[0];
        if (isNaN(listeLength) || listeLength < 1) return infoMsg(message, 'Random', await buildText("top_list_number", client, { guild: message.guild.id }), true, 5000);
        
        for (l = 0, i = 0; l < listeLength; l++) {
            ttrow[l] = "";
            for(row = 0; row < 10; i++) {
                if (top[i] === undefined) break;

                line = i+1;
                user = top[i].user;
                if (message.guild.members.cache.find(m => m.id === top[i].user) != undefined) {
                    user = message.guild.members.cache.find(m => m.id === top[i].user).user.username;
                } else {
                    user = (await search.user(client, user)).username;
                    if (user === undefined) user = top[i].user;
                }

                ttrow[l] += `
                <tr class="user">
                    <td class="id">#${line}</td>
                    <td class="name">${user}</td>
                    <td class="level">Level ${top[i].level}</td>
                    <td class="xp">XP ${top[i].xp}</td>
                </tr>`;

                row++;
            }
        }

        if (ttrow[listeLength-1].length <= 0) {
            const blankEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(await buildText("top_title", client, { guild: message.guild.id, message: message }))
                .setDescription(await buildText("top_empty_list", client, { guild: message.guild.id }))
			    .setTimestamp()
			    .setFooter({ text: `${message.author.username}#${message.author.discriminator}` });

            return message.channel.send({ embeds: [blankEmbed] });
        }

        const page = (args[0] === undefined) ? "2" : (parseInt(args[0]) + 1);
        let html_topten = `
            <html>
                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400&display=swap" rel="stylesheet">

                <style>
                    html, body {
                        background: transparent;
                        width: 500px;
                        height: 500px;
                        font-family: 'Nunito', sans-serif;
                    }

                    h1 {
                        text-align: center;
                        font-weight: bold;
                        font-size: 22px;
                        color: #fff;
                        padding-top: 10px;
                        margin-bottom: -10px;
                        text-shadow: 2px 2px 3px black;
                    }
                
                    .next {
                        text-align: center;
                        color: #fff;
                        text-shadow: 2px 2px 3px black;
                        font-size: 18px;
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
                        max-width: 200px;
                        overflow: hidden;
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
                <body>
                    <h1>${await buildText("top_title", client, { guild: message.guild.id, message: message })}</h1>
                    <p class="next">${await buildText("top_footer", client, { guild: message.guild.id, variables: [page] })}</p>
                    <table><tbody>${ttrow[listeLength-1]}</tbody></table>
                </body>
            </html>`;

        if (!fs.existsSync('./commands/stats/cache/')) await fs.mkdirSync('./commands/stats/cache/');

        let filePath = `./commands/stats/cache/${message.guild.id}_topten.png`;
        await nodeHtmlToImage({
            html: html_topten,
            transparent: true,
            puppeteerArgs: { args: ['--no-sandbox'] },
            output: filePath
        });

		const image = new AttachmentBuilder()
            .setFile(filePath)
            .setName('top10.png');

		message.channel.send({ files: [image] }).then(async msg => {
            if (await fs.existsSync(filePath)) await fs.unlinkSync(filePath);
        });
    }
}