module.exports = {
    check: async function(client, oldMember, newMember) {
        if (client.user.id === newMember.id && newMember.channel === null) client.queue.delete(newMember.guild.id);
    },
}