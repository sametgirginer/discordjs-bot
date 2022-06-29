const request = require("request");

module.exports = {
    spotify: async function (url) {
        if (!url) return null;

        const clientID = process.env.spotifyclientid;
        const clientSecret = process.env.spotifyclientsecret;
        const authBase64 = (Buffer.from(`${clientID}:${clientSecret}`)).toString('base64');

        return new Promise(async (resolve, reject) => {
            await request.post({
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    'Authorization': `Basic ${authBase64}`,
                    'Content-Type': "application/x-www-form-urlencoded",
                },
                form: {
                    grant_type: 'client_credentials'
                },
                json: true,
            }, async function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    const access_token = body.access_token;
                    
                    await request.get({
                        url: url,
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        json: true,
                    }, async function (err, response, body) {
                        if (!err && response.statusCode === 200) {
                            resolve(body);
                        } else {
                            reject(err);
                        }
                    });
                } else {
                    reject(err);
                }
            });
        });
    }
}