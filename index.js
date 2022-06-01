const { config } = require('dotenv');

config({
    path: __dirname + '/.env'
});

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('bot.js', {
    token: process.env.token
});

manager.spawn();
//manager.on('shardCreate', shard => console.log(` > Launched shard ${shard.id}`));