const sp = require("./speaking");
const st = require("./state");
const xp = require("./xp");

module.exports = {
    speaking: async function(client, loop) {
        sp.check(client, loop);
        xp.update(client, loop);
    },

    state: async function(client, oldMember, newMember) {
        st.check(client, oldMember, newMember);
    },
}