"use strict";
const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
spotifyApi.clientCredentialsGrant().
    then(function (result) {
    console.log('It worked! Your access token is: ' + result.body.access_token);
    spotifyApi.setAccessToken(result.body.access_token);
}).catch(function (err) {
    console.log('If this is printed, it probably means that you used invalid ' +
        'clientId and clientSecret values. Please check!');
    console.log('Hint: ');
    console.log(err);
});
const spots = {
    method: 'GET',
    path: '/hapi/spotify',
    handler: async (request, h) => {
        const res = await spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
        console.log(res.body);
        return res.body;
    }
};
module.exports = [spots];
