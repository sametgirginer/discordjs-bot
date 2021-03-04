const { infoMsg } = require('../../functions/message');
const db = require('../../functions/database');

module.exports = {
	name: 'lvlkontrol',
    category: 'pvserver',
    description: 'Yetkili komutu',
	prefix: true,
	owner: true,
	supportserver: true,
	permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        let members = await db.querySelectAll(`SELECT * FROM discord_levels WHERE guild = '${process.env.supportserver}'`);

        let Blackmailer = message.guild.roles.cache.find(r => r.name === "Blackmailer");
        let Consigliere = message.guild.roles.cache.find(r => r.name === "Consigliere");
        let Consort = message.guild.roles.cache.find(r => r.name === "Consort");
        let Disguiser = message.guild.roles.cache.find(r => r.name === "Disguiser");
        let Framer = message.guild.roles.cache.find(r => r.name === "Framer");
        let Janitor = message.guild.roles.cache.find(r => r.name === "Janitor");
        let Arsonist = message.guild.roles.cache.find(r => r.name === "Arsonist");
        let Mafioso = message.guild.roles.cache.find(r => r.name === "Mafioso");
        let Hypnotist = message.guild.roles.cache.find(r => r.name === "Hypnotist");
        let Godfather = message.guild.roles.cache.find(r => r.name === "Godfather");

        if (members) {
            members.forEach(member => {
                let mu = message.guild.members.cache.find(u => u.id === member.user);

                if (mu) {
                    if (member.level >= 50) return mu.roles.add(Godfather, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 45) return mu.roles.add(Hypnotist, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 40) return mu.roles.add(Mafioso, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 35) return mu.roles.add(Arsonist, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 30) return mu.roles.add(Janitor, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 25) return mu.roles.add(Framer, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 20) return mu.roles.add(Disguiser, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 15) return mu.roles.add(Consort, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 10) return mu.roles.add(Consigliere, `LevelUP. level: ${member.level}`);
                    else if (member.level >= 5) return mu.roles.add(Blackmailer, `LevelUP. level: ${member.level}`);
                }
            });
        }
    }
}