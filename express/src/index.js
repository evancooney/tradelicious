require('newrelic');
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

console.log('JAR JAR JAR token', process.env.SPOTIFY_CLIENT_ID,)

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().
then(function(result) {
    console.log('It worked! Your access token is: ' + result.body.access_token); 
    spotifyApi.setAccessToken(result.body.access_token);
}).catch(function(err) {
    console.log('If this is printed, it probably means that you used invalid ' +
    'clientId and clientSecret values. Please check!');
    console.log('Hint: ');
    console.log(err);
});




app.get('/express', (req, res) => {
  res.send('Hello, Docker!');
});

app.get('/express/spotify', async (req, res) => {


  
    const rez = await spotifyApi.getTrack('0RiRZpuVRbi7oqRdSMwhQY?si=dbba7f746f0141f9');
     console.log(rez.body) 
     res.json(rez.body);


});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});