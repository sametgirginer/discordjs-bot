module.exports = {
    levelup: async function(guild, member, level, messageOrGuild) {
        if (guild != process.env.supportserver) return;

        let r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,mu = "";

        if (messageOrGuild.author != undefined) {
            r1 = messageOrGuild.guild.roles.cache.find(r => r.name === "Ucube");
            r2 = messageOrGuild.guild.roles.cache.find(r => r.name === "Homo Erectus");
            r3 = messageOrGuild.guild.roles.cache.find(r => r.name === "Canavar");
            r4 = messageOrGuild.guild.roles.cache.find(r => r.name === "Yaratık");
            r5 = messageOrGuild.guild.roles.cache.find(r => r.name === "Ork");
            r6 = messageOrGuild.guild.roles.cache.find(r => r.name === "Troll");
            r7 = messageOrGuild.guild.roles.cache.find(r => r.name === "Goblin");
            r8 = messageOrGuild.guild.roles.cache.find(r => r.name === "Gollum");
            r9 = messageOrGuild.guild.roles.cache.find(r => r.name === "Gulyabani");
            r10 = messageOrGuild.guild.roles.cache.find(r => r.name === "Gardiyan Ucube");

            mu = messageOrGuild.guild.members.cache.find(u => u.id === member);
        } else if (messageOrGuild.icon) {
            r1 = messageOrGuild.roles.cache.find(r => r.name === "Ucube");
            r2 = messageOrGuild.roles.cache.find(r => r.name === "Homo Erectus");
            r3 = messageOrGuild.roles.cache.find(r => r.name === "Canavar");
            r4 = messageOrGuild.roles.cache.find(r => r.name === "Yaratık");
            r5 = messageOrGuild.roles.cache.find(r => r.name === "Ork");
            r6 = messageOrGuild.roles.cache.find(r => r.name === "Troll");
            r7 = messageOrGuild.roles.cache.find(r => r.name === "Goblin");
            r8 = messageOrGuild.roles.cache.find(r => r.name === "Gollum");
            r9 = messageOrGuild.roles.cache.find(r => r.name === "Gulyabani");
            r10 = messageOrGuild.roles.cache.find(r => r.name === "Gardiyan Ucube");

            mu = messageOrGuild.members.cache.find(u => u.id === member);
        }

        if (level >= 5 && level < 10) return mu.roles.add(r1, `LevelUP. level: ${level}`);

        if (level >= 10 && level < 15) {
            mu.roles.remove(r1, `LevelUP. level: ${level}`);
            mu.roles.add(r2, `LevelUP. level: ${level}`);
        }

        if (level >= 15 && level < 20) {
            mu.roles.remove(r2, `LevelUP. level: ${level}`);
            mu.roles.add(r3, `LevelUP. level: ${level}`);
        }

        if (level >= 20 && level < 25) {
            mu.roles.remove(r3, `LevelUP. level: ${level}`);
            mu.roles.add(r4, `LevelUP. level: ${level}`);
        }

        if (level >= 25 && level < 30) {
            mu.roles.remove(r4, `LevelUP. level: ${level}`);
            mu.roles.add(r5, `LevelUP. level: ${level}`);
        }

        if (level >= 30 && level < 35) {
            mu.roles.remove(r5, `LevelUP. level: ${level}`);
            mu.roles.add(r6, `LevelUP. level: ${level}`);
        }

        if (level >= 35 && level < 40) {
            mu.roles.remove(r6, `LevelUP. level: ${level}`);
            mu.roles.add(r7, `LevelUP. level: ${level}`);
        }

        if (level >= 40 && level < 45) {
            mu.roles.remove(r7, `LevelUP. level: ${level}`);
            mu.roles.add(r8, `LevelUP. level: ${level}`);
        }

        if (level >= 45 && level < 50) {
            mu.roles.remove(r8, `LevelUP. level: ${level}`);
            mu.roles.add(r9, `LevelUP. level: ${level}`);
        }

        if (level >= 50) {
            mu.roles.remove(r9, `LevelUP. level: ${level}`);
            mu.roles.add(r10, `LevelUP. level: ${level}`);
        }
    }
}