module.exports = {
    channelCheck: function(message, channel) {
        channel = channel.replace(/[#<>]/g, "");
        
        if(message.guild.channels.cache.get(channel))
            return true;

        return false;
    },

    getChannel: async function(message, key, channelInfo) {
        return new Promise((resolve) => {
            if(key === 'name' && message.guild.channels.cache.find(c => c.name === channelInfo)) {
                let channel = message.guild.channels.cache.find(c => c.name === channelInfo);
                resolve(JSON.parse(JSON.stringify(channel)));
            }

            if(key === 'id' && message.guild.channels.cache.find(c => c.id === channelInfo)) {
                let channel = message.guild.channels.cache.find(c => c.id === channelInfo);
                resolve(JSON.parse(JSON.stringify(channel)));
            }
                
            resolve(false);
        });
    }
}