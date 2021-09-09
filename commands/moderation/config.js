const { MessageEmbed } = require('discord.js');
const { queryInsert, querySelect, queryUpdate, queryDelete, getSetting } = require('../../functions/database.js');
const { roleCheck, getRole } = require('../../functions/roles.js');
const { channelCheck } = require('../../functions/channels.js');
const { infoMsg } = require('../../functions/message.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'ayar',
    category: 'moderasyon',
    description: 'Bot ayarlarını özelleştirin.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: [
        'MANAGE_CHANNELS',
        'MANAGE_ROLES',
        'VIEW_AUDIT_LOG',
        'BAN_MEMBERS',
        'KICK_MEMBERS'
    ],
    run: async (client, message, args) => {
        /* 
            HELP MESSAGE - YARDIM MESAJI
        */
        if (args[0] === 'yardım' || args[0] === 'help') {
            var ayarYardim = new MessageEmbed()
            .setColor('#65bff0')
            .addField('**Bilgilendirme Bölümü**', stripIndents`
                    Bot ayarını değiştirmek için: **${process.env.prefix}ayar** [**ayar adı**] [**değer**]
                    Bot ayarını tamamen silmek için: **${process.env.prefix}ayar sil** [**ayar adı**]
                    Herhangi bir ayar için birden fazla kanal eklenebilir.`, false)
            .addField('**Kanal Ayarları**',
                       stripIndents`**${process.env.prefix}ayar kanal oneri** _#öneri_
                                    **${process.env.prefix}ayar kanal giris** _#giriş_
                                    **${process.env.prefix}ayar kanal cikis** _#çıkış_
                                    **${process.env.prefix}ayar kanal botkomut** _#bot-komut_
                                    **${process.env.prefix}ayar kanal sunucutanitim** _#minecraft_`, true)
            .addField('**Destek Ayarları**',
                       stripIndents`**${process.env.prefix}ayar destek rol** _@Destek Ekibi_`, true)

            message.channel.send({ embeds: [ayarYardim] });
            message.delete();
        }

        if (!args.length) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, komut için gereken argümanlar girilmedi.\nArgümanları öğrenmek için: **${process.env.prefix}ayar yardım**`)

        /*
            CHANNEL SETTINGS - KANAL AYARLARI
        */
        if (args[0] === 'kanal') {
            if (args[1] === 'oneri' || args[1] === 'botkomut' || args[1] === 'sunucutanitim' || args[1] === 'giris' || args[1] === 'cikis') {
                if (args[2]) {
                    if (channelCheck(message, args[2])) {
                        args[2] = args[2].replace(/[#<>]/g, "");

                        if (await getSetting(message.guild.id, `${args[1]}`) === 0) {
                            let valArray = [args[2],];

                            queryInsert(`INSERT INTO discord_settings (guild, setting, value) VALUES ('${message.guild.id}', '${args[1]}', '${valArray}')`);
                            infoMsg(message, '65ed3b', `**${args[1]}** için başarıyla ayarlama yapıldı.`);
                        } else {
                            valArray = await querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = '${args[1]}'`);
                            if (valArray.value.includes(args[2])) return infoMsg(message, 'FFE26A', `<#${args[2]}> kanalı ayarlanmış durumda.`);
                            
                            valArray.value += ',' + args[2];
                            queryUpdate(`UPDATE discord_settings SET value = "${valArray.value}" WHERE guild = '${message.guild.id}' AND setting = '${args[1]}'`);
                            infoMsg(message, '65ed3b', `**${args[1]}** ayarı başarıyla güncellendi.`);
                        }
                    } else {
                        infoMsg(message, 'FFE26A', 'Bu **ID** ile eşelen herhangi bir kanal bulunamadı.');
                    }
                } else {
                    infoMsg(message, 'FFE26A', `Herhangi bir kanal belirtmediniz. Örnek #xxx`);
                }
            }
        }

        /*
            SUPPORT SETTINGS - DESTEK AYARLARI
        */
        if (args[0] === 'destek') {
            if (args[1] === 'rol') {
                if (args[2]) {
                    if (roleCheck(message, args[2])) {
                        args[2] = args[2].replace(/[@&<>]/g, "");
                        let role = await getRole(message, 'name', args[2]);

                        if (await getSetting(message.guild.id, 'destekrol') === 0) {
                            queryInsert(`INSERT INTO discord_settings (guild, setting, value) VALUES ('${message.guild.id}', 'destekrol', '${role.id}')`);
                            infoMsg(message, '65ed3b', `Destek kanalı için "**${role.name}**" rolü başarıyla ayarlandı.`);
                        } else {
                            queryUpdate(`UPDATE discord_settings SET value = '${role.id}' WHERE guild = '${message.guild.id}' AND setting = 'destekrol'`);
                            infoMsg(message, '65ed3b', `Destek kanalı için "**${role.name}**" rolü başarıyla güncellendi.`);
                        }
                    } else {
                        infoMsg(message, 'FFE26A', 'Böyle bir **ROL** sunucuda bulunamadı.');
                    }
                } else {
                    infoMsg(message, 'FFE26A', `Herhangi bir rol belirtmediniz. Örnek **Destek Yetkilisi**`);
                }
            }
        }

        /*
            SETTING DELETE - AYAR SİL
        */
        if (args[0] === 'sil') {
            if(args[1].length) {
                if (await getSetting(message.guild.id, args[1]) != 0) {
                    queryDelete(`DELETE FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = '${args[1]}'`);
                    infoMsg(message, '65ed3b', `**${args[1]}** ayarı başarıyla silindi.`);
                } else {
                    infoMsg(message, 'FFE26A', `"**${args[1]}**" adında bir ayar bulunamadı. Daha önceden böyle bir ayar yapılmamış olabilir.`);
                }
            }
        }
    }
}