const sp = require("./speaking");
const st = require("./state");

module.exports = {
    speaking: async function(client, loop) {
        sp.check(client, loop);
    },

    state: async function(client, oldMember, newMember) {
        st.check(client, oldMember, newMember);
    },
}