# tradelicious

Entry points
- hard partner links ( copy'ing from the site)
- unique value like ISRC
- artist title 


- search  on playlist???? and alubm and track

- search engine? Elastic serach?
- chache keys

Apple has ISRC !!!

https:/
/music.apple.com/us/album/notorious/693606394?i=693606402

Spotify 
- ISRC !

https://open.spotify.com/track/0RiRZpuVRbi7oqRdSMwhQY?si=dbba7f746f0141f9


Tidal!

{

}


onst express = require('express');
const app = express();
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 8080;
const publicDir = process.argv[2] || __dirname + '/public';
const path = require('path');

// library for signing tokens
const jwt = require('jsonwebtoken');
const fs = require('fs');

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, '/index.html'));
});

const private_key = fs.readFileSync('apple_private_key.p8').toString(); // read your private key from your file system
const team_id = 'ABCDEFGHIJ'; // your 10 character apple team id, found in https://developer.apple.com/account/#/membership/
const key_id = 'KLMNOPQRST'; // your 10 character generated music key id. more info https://help.apple.com/developer-account/#/dev646934554
const token = jwt.sign({}, private_key, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: team_id,
  header: {
    alg: 'ES256',
    kid: key_id
  }
});

app.get('/token', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({token: token}));
});

app.use(express.static(publicDir));

console.log('Listening at', publicDir, hostname, port);
app.listen(port, hostname);


{
"alg": "ES256",
"kid" : "BL77H4PHJA"
}