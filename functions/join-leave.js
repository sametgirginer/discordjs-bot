const { MessageEmbed } = require('discord.js');
const { queryInsert, querySelect, queryUpdate, queryDelete, getInvite } = require('./database.js');
const levelSystem = require('./level');
const pvrole = require('./private-server/role');

module.exports = {
    serverJoin: async function(member, guildInvites) {
        if (member.id === null || member.id === undefined || member === undefined) return;

        try {
            let channel = JSON.parse(JSON.stringify(await querySelect(`SELECT value FROM discord_settings WHERE guild = '${member.guild.id}' AND setting = 'giris'`)));
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel.value);
            let inviteCount = 0;

            let role = guild.roles.cache.find(r => r.name == "Yeni");
            if (role != undefined) await member.roles.add(role).catch(console.error);

            if (!msgChannel) return;
    
            const cachedInvites = guildInvites.get(member.guild.id);
            const newInvites = await member.guild.fetchInvites();
            guildInvites.set(member.guild.id, newInvites);
            const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

            levelSystem.dbCheck(guild, member);
    
            if (usedInvite != undefined) {
                if (await getInvite(guild.id, member.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${member.id}', '0', '${usedInvite.inviter.id}')`);
                if (await getInvite(guild.id, usedInvite.inviter.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${usedInvite.inviter.id}', '1', '0')`);
                else {
                    let data = JSON.parse(JSON.stringify(await querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`)));
                    inviteCount = Number(data.invitecount) + 1;
                    queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`);
                }
                
                if (inviteCount === 0) inviteCount = 1;
                var joinEmbed = new MessageEmbed()
                    .setColor('#' + (Math.random()*0xFFFFFF<<0).toString(16))
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor(`Hoş geldin!`, guild.iconURL({ format: 'png', dynamic: true }))
                    .setDescription(`<@${member.id}>, **${guild.name}** discord sunucusuna hoş geldin.\nDavet eden: **${usedInvite.inviter.tag}** (**${inviteCount}** davet)`)
            } else {
                var joinEmbed = new MessageEmbed()
                    .setColor('#' + (Math.random()*0xFFFFFF<<0).toString(16))
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor(`Hoş geldin!`, guild.iconURL({ format: 'png', dynamic: true }))
                    .setDescription(`<@${member.id}>, **${guild.name}** discord sunucusuna hoş geldin.`)
            }
            msgChannel.send(joinEmbed);

            //Private Server
            let level = await levelSystem.getLevel(guild.id, member.id);
            pvrole.levelup(guild.id, member.id, level, guild);
        } catch (error) {
            console.log(error);
        }
    },

    serverLeave: async function(member, guildInvites) {
        if (member.id === null || member.id === undefined || member === undefined) return;

        try {
            let channel = JSON.parse(JSON.stringify(await querySelect(`SELECT value FROM discord_settings WHERE guild = '${member.guild.id}' AND setting = 'cikis'`)));
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel.value);
            let inviteCount = 0;
        
            if (!msgChannel) return;
            if (await getInvite(guild.id, member.id) === 1) {
                let invdata = JSON.parse(JSON.stringify(await querySelect(`SELECT inviter FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`)));
                if (invdata.inviter === 0 || invdata.inviter === null) return;
    
                let data = JSON.parse(JSON.stringify(await querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`)));
                inviteCount = Number(data.invitecount) - 1;
    
                queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`);
                queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`);
            }
            
            var leaveEmbed = new MessageEmbed()
                .setColor('#' + (Math.random()*0xFFFFFF<<0).toString(16))
                .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                .setAuthor(`Görüşürüz!`, guild.iconURL({ format: 'png', dynamic: true }))
                .setDescription(`${member.user.username}#${member.user.discriminator}, discord sunucusundan ayrıldı.\nAramıza tekrar katılman dileğiyle.`)
    
            msgChannel.send(leaveEmbed);
        } catch (error) {
            console.log(error);
        }
    },

    createInvite: async function(invite, guildInvites) {
        if (invite === undefined || invite.inviter.id === undefined) return;

        try {
            guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
            if (await getInvite(invite.guild.id, invite.inviter.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${invite.guild.id}', '${invite.inviter.id}', '0', '0')`);
        } catch (error) {
            console.log(error);
        }
    }
}