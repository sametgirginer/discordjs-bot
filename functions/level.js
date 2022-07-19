const db = require('./database');
const role = require('./private-server/role');
const { infoMsg } = require('./message');
const { buildText } = require('./language');

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
    
    updateLevel: async function(guild, member, xp, messageOrGuild) {
        let level = await this.getLevel(guild, member);
        let xplimit = await this.getXPLimit(guild, member);

        if (xp > xplimit) {
            if (level < 5) xplimit += 500;
            if (level >= 5 && level < 10) xplimit += 1000;
            if (level >= 10 && level < 20) xplimit += 2000;
            if (level >= 20 && level < 30) xplimit += 4000;
            if (level >= 30 && level < 40) xplimit += 4500;
            if (level >= 40 && level < 50) xplimit += 5000;
            if (level >= 50) xplimit += 6000;

            level++;
            await db.queryUpdate(`UPDATE discord_levels SET xplimit = '${xplimit}' WHERE guild = '${guild}' AND user = '${member}'`);
            await db.queryUpdate(`UPDATE discord_levels SET level = '${level}' WHERE guild = '${guild}' AND user = '${member}'`);

            //Private Server
            role.levelup(guild, member, level, messageOrGuild);

            if (messageOrGuild.author != undefined) infoMsg(messageOrGuild, 'Random', await buildText("level_up", messageOrGuild.client, { guild: guild, variables: [member, level] }));
        }
    },

    setLevel: async function(guild, member) {
        
    },

    updateMessageXP: async function(message) {
        if (message.guild.id === process.env.supportserver && message.channel.name.search("bot") >= 0) return;

        let guild = message.guild.id;
        let member = message.author.id;
        let level = (await this.getLevel(guild, member));
        let xp = (await this.getXP(guild, member));

        if (xp === undefined) xp = 0;

        if (await this.getStats(guild, member) === 0) {
            await this.addUser(guild, member);
        }

        if (level < 10) xp += 7;
        else if (level >= 10 && level < 20) xp += 5;            
        else if (level >= 20 && level < 30) xp += 4;
        else if (level >= 30 && level < 40) xp += 3;
        else if (level >= 40 && level < 50) xp += 1;
        else if (level >= 50) xp += 0.5;

        await db.queryUpdate(`UPDATE discord_levels SET xp = '${xp}' WHERE guild = '${guild}' AND user = '${member}'`);
        await this.updateLevel(guild, member, xp, message);
    },

    updateVoiceXP: async function(guild, channel, member) {
        if (channel.id === guild.afkChannelID) return;

        let level = (await this.getLevel(guild.id, member.id));
        let xp = (await this.getXP(guild.id, member.id));

        if (xp === undefined) xp = 0;

        if (await this.getStats(guild.id, member.id) === 0) {
            await this.addUser(guild.id, member.id);
        }

        if (level < 20) xp += 3;            
        else if (level >= 20 && level < 30) xp += 2;
        else if (level >= 30 && level < 40) xp += 1.5;
        else if (level >= 40 && level < 50) xp += 1;
        else if (level >= 50) xp += 0.5;

        await db.queryUpdate(`UPDATE discord_levels SET xp = '${xp}' WHERE guild = '${guild.id}' AND user = '${member.id}'`);
        await this.updateLevel(guild.id, member.id, xp, guild);
    }
    
}