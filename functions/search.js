module.exports = {
    user: async function(client, id, message, name) {
        if (id != null) return client.users.fetch(id);
        else if (message != null) {
            let member = message.guild.members.cache.find(m => (m.user.username).toLowerCase().includes(name.toLowerCase()));
            return (member) ? member.user : false;
        }
    },
}