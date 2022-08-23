const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { ready } = require('./handler/ready');
const joinLeaveFunctions = require('./functions/join-leave');
const interactionHandler = require('./handler/interaction');
const messageHandler = require('./handler/message');
const guildHandler = require('./handler/guild');
const voiceHandler = require('./functions/voice/index');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember
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

client.on('inviteCreate', async invite => joinLeaveFunctions.createInvite(client, invite, guildInvites));
client.on('inviteDelete', async invite => joinLeaveFunctions.deleteInvite(client, invite, guildInvites));

client.login(process.env.token);