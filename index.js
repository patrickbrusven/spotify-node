const querystring = require('querystring');
const express = require('express')
require('dotenv').config()
const app = express()
const port = 8080

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'user-read-private user-read-email',
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  res.send(code);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})