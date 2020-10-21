module.exports = {
    roleCheck: function(message, roleName) {
        if(message.guild.roles.cache.find(r => r.name === roleName))
            return true;
            
        return false;
    },

    getRole: async function(message, key, roleInfo) {
        return new Promise((resolve) => {
            if(key === 'name' && message.guild.roles.cache.find(r => r.name === roleInfo)) {
                let role = message.guild.roles.cache.find(r => r.name === roleInfo);
                resolve(JSON.parse(JSON.stringify(role)));
            }

            if(key === 'id' && message.guild.roles.cache.find(r => r.id === roleInfo)) {
                let role = message.guild.roles.cache.find(r => r.id === roleInfo);
                resolve(JSON.parse(JSON.stringify(role)));
            }
                
            resolve(false);
        });
    }
}