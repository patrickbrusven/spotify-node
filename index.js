const express = require('express')
require('dotenv').config()
const app = express()
const port = 8080

const clientID = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET

app.get('/', (req, res) => {
  res.send(clientID + 'hello world')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})