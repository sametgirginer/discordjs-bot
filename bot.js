const { Client, Intents, Permissions, Collection } = require('discord.js');
const { infoMsg } = require('./functions/message');
const { writeLog } = require('./functions/logger')
const { permCheck } = require('./functions/permission.js');
const { serverJoin, serverLeave, createInvite } = require('./functions/join-leave');
const { autoResponse } = require('./functions/autoresponse');
const levelSystem = require('./functions/level');
const { reactionAdd, reactionRemove, react } = require('./functions/reaction');
const voice = require('./functions/voice/index');

const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});
const prefix = process.env.prefix;
const guildInvites = new Map();
    
client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Map();

client.log = require('./handler/log');
['command'].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on('ready', () => {
    console.log(` > Discord botu ${client.user.tag} kimliği ile başlatıldı.`);
    client.user.setPresence({
        activity: {
            name: `📌 ${process.env.prefix}yardım`,
        },
        status: 'online',
    });

    client.guilds.cache.forEach(guild => {
        voice.speaking(client, guild, true);

        guild.members.fetch();

        if (guild.members.cache.find(member => member.id == client.user.id).permissions.has(Permissions.FLAGS.MANAGE_GUILD))
            guild.invites.fetch()
                .then(invites => guildInvites.set(guild.id, invites))
                .catch(err => console.log(err));
    });

    try {
        client.guilds.cache.get('735836120272601120').channels.cache.get('756692193682391111').messages.fetch('756692733665607700'); //bir
        client.guilds.cache.get('803703371936432219').channels.cache.get('803919202108178475').messages.fetch('803919359776784405'); //iki
    } catch (error) { }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.members.fetch();

    writeLog(message);
    autoResponse(message);
    react(message);
    levelSystem.updateMessageXP(message);

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

client.on('voiceStateUpdate', async (oldMember, newMember) => voice.state(client, oldMember, newMember));

client.on('guildMemberAdd', async (member) => serverJoin(member, guildInvites));
client.on('guildMemberRemove', member => serverLeave(member, guildInvites));

client.on('inviteCreate', invite => createInvite(invite, guildInvites));

client.on("messageReactionAdd", async (reaction, user) => reactionAdd(reaction, user));
client.on("messageReactionRemove", async (reaction, user) => reactionRemove(reaction, user));

client.login(process.env.token);