const { Client, Intents, Collection } = require('discord.js');
const { ready } = require('./handler/ready');
const { serverJoin, serverLeave, createInvite, deleteInvite } = require('./functions/join-leave');
const msg = require('./handler/message');
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

const guildInvites = new Map();    
const guildLangs = new Map();    

client.commands = new Collection();
client.langs = new Collection();
client.aliases = new Collection();
client.queue = new Map();

client.log = require('./handler/log');
require(`./handler/command`)(client);
require('./handler/language')(client);

client.on('ready', async () => ready(client, { guildInvites: guildInvites, guildLangs: guildLangs }));

client.on('messageCreate', async message => msg.create(client, message));
client.on("messageReactionAdd", async (reaction, user) => msg.reactionAdd(reaction, user));
client.on("messageReactionRemove", async (reaction, user) => msg.reactionRemove(reaction, user));

client.on('voiceStateUpdate', async (oldMember, newMember) => voice.state(client, oldMember, newMember));

client.on('guildMemberAdd', async member => serverJoin(member, guildInvites));
client.on('guildMemberRemove', async member => serverLeave(member, guildInvites));

client.on('inviteCreate', async invite => createInvite(invite, guildInvites));
client.on('inviteDelete', async invite => deleteInvite(invite, guildInvites));

client.login(process.env.token);