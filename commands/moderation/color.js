const { MessageEmbed } = require('discord.js');
const { querySelect, queryInsert, queryUpdate } = require('../../functions/database.js');
const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'color',
    category: 'moderasyon',
    description: 'Renk rolü ekler.',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: ['MANAGE_ROLES'],
    run: async (client, message, args) => {
        try {
            let data = (await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'color'`))['value'];
            let colorCode = args[0];
            let colorName = "";

            for (let i = 1; i < args.length; i++) {
                colorName += `${args[i]} `;                
            }

            const colorSettings = {
                textChannel: message.channel.id,
                colors: [],
            }

            const color = {
                code: colorCode,
                name: colorName
            }

            colorSettings.colors.push(color);

            if (args.length >= 1) {
                if (data) {
                    infoMsg(message, colorCode, `renk eklendi`);
                    data = JSON.parse(data);
                    data.colors.push(color);
                    console.log(data);
                    

                    queryUpdate(`UPDATE discord_settings SET value = '${JSON.stringify(data)}' WHERE guild = '${message.guild.id}' AND setting = 'color'`);

                } else {
                    queryInsert(`INSERT INTO discord_settings (guild, setting, value) VALUES ('${message.guild.id}', 'color', '${JSON.stringify(colorSettings)}')`);



                }
            } else {
                if (!data) {
                    // İlk kullanım - first usage
                    infoMsg(message, 'RANDOM', `bu bilgilendirme ön mesajıdır... bu kısım düzenlenecek`);
    
    
                    
                } else {
                    // Add color info
                    infoMsg(message, 'RANDOM' `add color a!color #XXXXX Siyah`);

                }
            }
        } catch (error) {
            client.log.sendError(client, error, message)
        }
    }
}