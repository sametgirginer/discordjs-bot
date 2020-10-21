module.exports = {
    permCheck: function(message, perms) {
        if(message.member.hasPermission(perms))
            return true;
            
        return false;
    }
}