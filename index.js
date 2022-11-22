const express = require('express')
require('dotenv').config()
const app = express()
const port = 8080

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' + `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user-read-private%20user-read-email`);
})

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  res.send(code);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})