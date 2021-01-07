module.exports = {
    user: async function(client, id) {
        return client.users.fetch(id);
    },
}