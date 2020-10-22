const { MessageEmbed } = require('discord.js');
const db = require('./database');
const { infoMsg } = require('./message');

module.exports = {
    getStats: async function(guild, member) {
        return await db.querySelect(`SELECT * FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`);
    },

    getLevel: async function(guild, member) {
        return (await db.querySelect(`SELECT level FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`))['level'];
    },

    getXP: async function(guild, member) {
        return (await db.querySelect(`SELECT xp FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`))['xp'];
    },

    getXPLimit: async function(guild, member) {
        return (await db.querySelect(`SELECT xplimit FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`))['xplimit'];
    },

    addUser: async function(guild, member) {
        await db.queryInsert(`INSERT INTO discord_levels (guild, user, xp, xplimit, level) VALUES ('${guild}', '${member}', '0', '500', '0')`);
    },

    dbCheck: async function(guild, member) {
        let xp = await this.getXP(guild.id, member.id);
        
        if (xp === 0) {
            await this.addUser(guild.id, member.id);
            return true;
        }

        return false;
    },
    
    updateLevel: async function(guild, member, xp, message) {
        let level = await this.getLevel(guild, member);
        let xplimit = await this.getXPLimit(guild, member);

        if (xp > xplimit) {
            if (level < 5) xplimit += 500;
            if (level > 5 && level < 10) xplimit += 1000;
            if (level > 10 && level < 20) xplimit += 5000;
            if (level > 20 && level < 30) xplimit += 10000;
            if (level > 40 && level < 50) xplimit += 15000;
            if (level > 50) xplimit += 18000;

            level++;
            await db.queryUpdate(`UPDATE discord_levels SET xplimit = '${xplimit}' WHERE guild = '${guild}' AND user = '${member}'`);
            await db.queryUpdate(`UPDATE discord_levels SET level = '${level}' WHERE guild = '${guild}' AND user = '${member}'`);

            infoMsg(message, 'RANDOM', `<@${member}> level atladı! **Şu anki leveli: ${level}**`);                
        }
    },

    setLevel: async function(guild, member) {
        
    },

    updateMessageXP: async function(message) {
        let guild = message.guild.id;
        let member = message.author.id;
        let level = (await this.getLevel(guild, member));
        let xp = (await this.getXP(guild, member));      

        if (await this.getStats(guild, member) === 0) {
            await this.addUser(guild, member);
        }

        if (level < 10) xp += 5;
        else if (level > 10 && level < 20) xp += 4;            
        else if (level > 25 && level < 30) xp += 2;
        else if (level > 30 && level < 35) xp += 1.5;
        else if (level > 40 && level < 50) xp += 0.8;
        else if (level > 50) xp += 0.5;

        await db.queryUpdate(`UPDATE discord_levels SET xp = '${xp}' WHERE guild = '${guild}' AND user = '${member}'`);
        await this.updateLevel(guild, member, xp, message);
    }
    
}