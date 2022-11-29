const express = require('express')
require('dotenv').config()
const querystring = require('querystring');
const request = require('request');

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
  const scope = 'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public';
  res.cookie(stateKey, state);
  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: scope,
    state: state,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

app.get('/callback', function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    console.log('here');
  } else {
    res.clearCookie(stateKey);

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
          'base64',
        )}`,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const token_type = body.token_type;
        const refresh_token = body.refresh_token;

        const getMeOptions = {
          url: 'https://api.spotify.com/v1/me/top/artists',
          headers: {
            Authorization: `${token_type} ${access_token}`
          },
          json: true,
        };
        request.get(getMeOptions, function (error, response, body) {
          res.send(body);
        });
      } else {
        res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})