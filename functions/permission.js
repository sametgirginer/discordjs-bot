module.exports = {
    permCheck: function(message, perms, userID) {
        if (userID === undefined) {
            if(message.member.permissions.has(perms))
                return true;

            return false;
        } else {
            if (message.channel.permissionsFor(userID).has(perms))
                return true;
            
            return false;
        }
    },
}