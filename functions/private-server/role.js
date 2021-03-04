module.exports = {
    levelup: async function(guild, member, level, message) {
        if (guild != process.env.supportserver) return;

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

        let mu = message.guild.members.cache.find(u => u.id === member);

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