module.exports = {
    member: async function(message, id) {
        if (!id) id = message.author.id;
        let member = message.guild.members.cache.get(id);
        return (member) ? member : false;
    },

    user: async function(client, id, message, name) {
        if (id != null) return client.users.fetch(id);
        else if (message != null) {
            let member = message.guild.members.cache.find(m => (m.user.username).toLowerCase().includes(name.toLowerCase()));
            return (member) ? member.user : false;
        }
    },
}