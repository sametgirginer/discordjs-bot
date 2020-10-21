const db = require('./database');

module.exports = {
    getLevel: async function(guild, member) {
        return await db.querySelect(`SELECT level FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`);
    },

    getXP: async function(guild, member) {
        return await db.querySelect(`SELECT xp FROM discord_levels WHERE guild = '${guild}' AND user = '${member}'`);
    },

    addUser: async function(guild, member) {
        await db.queryInsert(`INSERT INTO discord_levels (guild, user, xp, level) VALUES ('${guild}', '${member}', '0', '0')`);
    },

    dbCheck: async function(guild, member) {
        let xp = await this.getXP(guild.id, member.id);
        
        if (xp === 0) {
            await this.addUser(guild.id, member.id);
            return true;
        }

        return false;
    },
    
    updateLevel: async function(guild, member) {
        await db.queryUpdate(`UPDATE discord_levels SET level = '${level}' WHERE guild = '${guild}' AND user = '${member}'`);
    },

    setLevel: async function(guild, member) {

    },

    updateXP: async function(message) {
        let guild = message.guild.id;
        let member = message.author.id;
        let level = (await this.getLevel(guild, member))['level'];
        let xp = (await this.getXP(guild, member))['xp'];            

        if (xp === 0) {
            await this.addUser(guild, member);
        }

        xp++;
        await db.queryUpdate(`UPDATE discord_levels SET xp = '${xp}' WHERE guild = '${guild}' AND user = '${member}'`);

        if (xp >= 50 && xp <= 100) {
            level = 1;
            await this.updateLevel(guild, member);
        }
    }
    
}