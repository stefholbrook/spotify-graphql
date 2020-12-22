// * https://github.com/lowsky/spotify-graphql-server
// * https://github.com/joeprabawa/spotify-graphql-wrapper
// * spotify-web-api-node

const fetch = require('node-fetch')

require('dotenv').config()

const {
  CLIENT_ID = 'INVAVLID_CLIENT_ID',
  CLIENT_SECRET = 'INVAVLID_CLIENT_SECRET'
} = process.env

const authorizationHeader = () => `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`

const authOptions = {
  token_url: 'https://accounts.spotify.com/api/token'
}

let expireTime = 0

module.exports = {
  isExpired: () => {
    if(expireTime) {
      return Date.now() > expireTime
    }

    return false
  },
  authenticate: () => {
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': authorizationHeader()
      },
      method: 'POST',
      body: 'grant_type=client_credentials&scope=user-read-private user-read-email playlist-read-collaborative'
    }

    return fetch(authOptions.token_url, options)
      .then((response) => {
        return response.json()
      })
      .then((token) => {
        const time = Date.now()
        const expires_in = Number.parseInt(token.expires_in, 10)

        expireTime = time + expires_in + 1000

        return token
      })
  }
}
