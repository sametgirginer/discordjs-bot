const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { querySelect, querySelectBool } = require('./functions/database');
const { infoMsg } = require('./functions/message');
const { writeLog } = require('./functions/logger')
const { permCheck } = require('./functions/permission.js');
const { serverJoin, serverLeave, createInvite } = require('./functions/join-leave');
const { autoResponse } = require('./functions/autoresponse');
const levelSystem = require('./functions/level');

const client = new Client();
const prefix = process.env.prefix;
const guildInvites = new Map();
    
client.commands = new Collection();
client.aliases = new Collection();

['command'].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

const coubDataFiles = fs.readdirSync('./data/coub').filter(file => file.endsWith('.mp4'));
for (const file of coubDataFiles) {
	const dFile = './data/coub/' + file;
	fs.unlinkSync(dFile);
}

client.on('ready', () => {
    console.log(` > Discord botu ${client.user.tag} kimliği ile başlatıldı.`);
    client.user.setPresence({
        activity: {
            name: `📌 ${process.env.prefix}yardım`,
        },
        status: 'online',
    });

    client.guilds.cache.forEach(guild => {
        guild.members.fetch();
        if (guild.member(client.user).hasPermission('MANAGE_GUILD'))
            guild.fetchInvites()
                .then(invites => guildInvites.set(guild.id, invites))
                .catch(err => console.log(err));
    });

    try {
        client.guilds.cache.get('735836120272601120').channels.cache.get('756692193682391111').messages.fetch('756692733665607700');
    } catch (error) { }
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    /*
        FUNCTIONS - FONKSİYONLAR
    */
    writeLog(message);
    autoResponse(message);
    levelSystem.updateMessageXP(message);
    
    if (await querySelectBool(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'oneri'`)) {
        valArray = JSON.parse(JSON.stringify(await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'oneri'`)));
        valArray = valArray.value.split(",");
        valArray.forEach(async ch => {
            if (message.channel.id === ch) {
                await message.react('✅');
                await message.react('❌');
            }
        });
    }

    if (await querySelectBool(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'sunucutanitim'`)) {
        valArray = JSON.parse(JSON.stringify(await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'sunucutanitim'`)));
        valArray = valArray.value.split(",");
        valArray.forEach(async ch => {
            if (message.channel.id === ch) {
                if (!message.content.startsWith(prefix + 'mc'))
                    await message.delete();
            }
        });
    }

    if (!message.content.startsWith(prefix)) {
        const args = message.content.trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        let command = client.commands.get(cmd);    
        if (!command) command = client.commands.find(c => c.aliases && c.aliases.includes(cmd));

        if (command && !command.prefix && command.supportserver === true && message.guild.id != process.env.supportserver)
            return infoMsg(message, '65bff0', `<@${message.author.id}>, bu komut sadece botun **discord destek** sunucusunda kullanılabilir.`, true, 5000);
        
        if ((command && !command.owner && !command.prefix) || (command && command.owner && message.author.id === process.env.ownerid)) {
            try {
                if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, bu komutu kullanmak için maalesef yetkiniz yok.`);
                command.run(client, message, args);
            } catch (error) {
                console.log(` > HATA: ${error}`);
                infoMsg(message, '000', `Komut çalıştırılırken bir hata oluştu.`, true, 10000);
            }
        } else return;
    } else {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);
        if (!command) command = client.commands.find(c => c.aliases && c.aliases.includes(cmd));

        if (command && command.supportserver === true && message.guild.id != process.env.supportserver)
            return infoMsg(message, '65bff0', `<@${message.author.id}>, bu komut sadece botun **discord destek** sunucusunda kullanılabilir.`, true, 8000);

        if ((command && !command.owner && command.prefix) || (command && command.owner && message.author.id === process.env.ownerid)) {
            try {
                if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, bu komutu kullanmak için maalesef yetkiniz yok.`);
                command.run(client, message, args);
            } catch (error) {
                console.log(` > HATA: ${error}`);
                infoMsg(message, '000', `Komut çalıştırılırken bir hata oluştu.`, true, 10000);
            }
        } else return;
    }
});

client.on('guildMemberAdd', member => serverJoin(member, guildInvites));
client.on('guildMemberRemove', member => serverLeave(member, guildInvites));
client.on('inviteCreate', invite => createInvite(invite, guildInvites));

client.on("messageReactionAdd", async (reaction, user) => {
    if (user && !user.bot && reaction.message.channel.guild) {
        if (reaction.message.channel.name === "kayıt") {
            if (reaction.emoji.name == "✅") {
                let r = reaction.message.guild.roles.cache.find(r => r.name == "🍁");
                let r2 = reaction.message.guild.roles.cache.find(r => r.name == "Yeni");
                await reaction.message.guild.member(user).roles.add(r).catch(console.error);
                await reaction.message.guild.member(user).roles.remove(r2).catch(console.error);
            }
        }
    }
});

client.login(process.env.token);