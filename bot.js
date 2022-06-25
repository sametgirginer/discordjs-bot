const { Client, Intents, Collection } = require('discord.js');
const { ready } = require('./handler/ready');
const joinLeaveFunctions = require('./functions/join-leave');
const interactionHandler = require('./handler/interaction');
const messageHandler = require('./handler/message');
const guildHandler = require('./handler/guild');
const voiceHandler = require('./functions/voice/index');

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

client.setMaxListeners(0);

const guildInvites = new Map();  

client.slashCommands = new Collection();
client.commands = new Collection();
client.langs = new Collection();
client.aliases = new Collection();
client.queue = new Map();

client.log = require('./handler/log');
require(`./handler/command`)(client);
require('./handler/language')(client);

client.on('ready', async () => ready(client, guildInvites));

client.on('guildCreate', async guild => guildHandler.create(client, guild));
client.on('guildDelete', async guild => guildHandler.delete(client, guild));

client.on('interactionCreate', async interaction => interactionHandler.create(client, interaction));

client.on('messageCreate', async message => messageHandler.create(client, message));
client.on("messageReactionAdd", async (reaction, user) => messageHandler.reactionAdd(reaction, user));
client.on("messageReactionRemove", async (reaction, user) => messageHandler.reactionRemove(reaction, user));

client.on('voiceStateUpdate', async (oldMember, newMember) => voiceHandler.state(client, oldMember, newMember));

client.on('guildMemberAdd', async member => joinLeaveFunctions.serverJoin(client, member, guildInvites));
client.on('guildMemberRemove', async member => joinLeaveFunctions.serverLeave(client, member, guildInvites));

client.on('inviteCreate', async invite => joinLeaveFunctions.createInvite(invite, guildInvites));
client.on('inviteDelete', async invite => joinLeaveFunctions.deleteInvite(invite, guildInvites));

client.login(process.env.token);