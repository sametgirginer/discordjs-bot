module.exports = {
    levelup: async function(guild, member, level, messageOrGuild) {
        if (guild != process.env.supportserver) return;

        let Blackmailer,Consigliere,Consort,Disguiser,Framer,Janitor,Arsonist,Mafioso,Hypnotist,Godfather,mu = "";
        /*let Consigliere = "";
        let Consort = "";
        let Disguiser = "";
        let Framer = "";
        let Janitor = "";
        let Arsonist = "";
        let Mafioso = "";
        let Hypnotist = "";
        let Godfather = "";
        let mu = "";*/

        if (messageOrGuild.author.id) {
            Blackmailer = messageOrGuild.guild.roles.cache.find(r => r.name === "Blackmailer");
            Consigliere = messageOrGuild.guild.roles.cache.find(r => r.name === "Consigliere");
            Consort = messageOrGuild.guild.roles.cache.find(r => r.name === "Consort");
            Disguiser = messageOrGuild.guild.roles.cache.find(r => r.name === "Disguiser");
            Framer = messageOrGuild.guild.roles.cache.find(r => r.name === "Framer");
            Janitor = messageOrGuild.guild.roles.cache.find(r => r.name === "Janitor");
            Arsonist = messageOrGuild.guild.roles.cache.find(r => r.name === "Arsonist");
            Mafioso = messageOrGuild.guild.roles.cache.find(r => r.name === "Mafioso");
            Hypnotist = messageOrGuild.guild.roles.cache.find(r => r.name === "Hypnotist");
            Godfather = messageOrGuild.guild.roles.cache.find(r => r.name === "Godfather");

            mu = messageOrGuild.guild.members.cache.find(u => u.id === member);
        } else if (messageOrGuild.icon) {
            Blackmailer = messageOrGuild.roles.cache.find(r => r.name === "Blackmailer");
            Consigliere = messageOrGuild.roles.cache.find(r => r.name === "Consigliere");
            Consort = messageOrGuild.roles.cache.find(r => r.name === "Consort");
            Disguiser = messageOrGuild.roles.cache.find(r => r.name === "Disguiser");
            Framer = messageOrGuild.roles.cache.find(r => r.name === "Framer");
            Janitor = messageOrGuild.roles.cache.find(r => r.name === "Janitor");
            Arsonist = messageOrGuild.roles.cache.find(r => r.name === "Arsonist");
            Mafioso = messageOrGuild.roles.cache.find(r => r.name === "Mafioso");
            Hypnotist = messageOrGuild.roles.cache.find(r => r.name === "Hypnotist");
            Godfather = messageOrGuild.roles.cache.find(r => r.name === "Godfather");

            mu = messageOrGuild.members.cache.find(u => u.id === member);
        }

        if (level === 5) return mu.roles.add(Blackmailer, `LevelUP. level: ${level}`);

        if (level === 10) {
            mu.roles.remove(Blackmailer, `LevelUP. level: ${level}`);
            mu.roles.add(Consigliere, `LevelUP. level: ${level}`);
        }

        if (level === 15) {
            mu.roles.remove(Consigliere, `LevelUP. level: ${level}`);
            mu.roles.add(Consort, `LevelUP. level: ${level}`);
        }

        if (level === 20) {
            mu.roles.remove(Consort, `LevelUP. level: ${level}`);
            mu.roles.add(Disguiser, `LevelUP. level: ${level}`);
        }

        if (level === 25) {
            mu.roles.remove(Disguiser, `LevelUP. level: ${level}`);
            mu.roles.add(Framer, `LevelUP. level: ${level}`);
        }

        if (level === 30) {
            mu.roles.remove(Framer, `LevelUP. level: ${level}`);
            mu.roles.add(Janitor, `LevelUP. level: ${level}`);
        }

        if (level === 35) {
            mu.roles.remove(Janitor, `LevelUP. level: ${level}`);
            mu.roles.add(Arsonist, `LevelUP. level: ${level}`);
        }

        if (level === 40) {
            mu.roles.remove(Arsonist, `LevelUP. level: ${level}`);
            mu.roles.add(Mafioso, `LevelUP. level: ${level}`);
        }

        if (level === 45) {
            mu.roles.remove(Mafioso, `LevelUP. level: ${level}`);
            mu.roles.add(Hypnotist, `LevelUP. level: ${level}`);
        }

        if (level === 50) {
            mu.roles.remove(Hypnotist, `LevelUP. level: ${level}`);
            mu.roles.add(Godfather, `LevelUP. level: ${level}`);
        }
    }
}