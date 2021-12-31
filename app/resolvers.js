const fetch = require('node-fetch')

function errorMsg (error) {
  if (error) {
    const { status = '', message = 'no details' } = error
    return `Error: ${status}: ${message}`
  }

  return `An unknown error`
}

function throwExceptionOnError (data) {
  if (data.error) {
    throw new Error(errorMsg(data.error))
  }
}

const headers = {
  'Accept': 'application/json',
  'Authorization': ''
}

const client_credentials = require('./schema')

let awaitingAuthorization

const spotifyProxy = () => {
  if (awaitingAuthorization && !client_credentials.isExpired()) {
    // use existing promise if not expired
    return awaitingAuthorization
  }

  if (!awaitingAuthorization || client_credentials.isExpired()) {
    awaitingAuthorization = new Promise((resolve, reject) => {
      client_credentials.authenticate()
        .then((token) => {
          headers.Authorization = `Bearer ${token.access_token}`

          resolve(headers)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  return awaitingAuthorization
}

const haveHeadersWithAuthToken = async () => {
    return await spotifyProxy()
}

const resolvers = {
  Query: {
    hi: () => "there",
    fetchArtistById: async (_, args) => {
      try {
        console.log(`debug: query artist ${JSON.stringify(args)} `)

        const response = await fetch(`https://api.spotify.com/v1/artists/${args.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    fetchArtistByName: async (_, args) => {
      try {
        console.log(`debug: query artist ${JSON.stringify(args)} `)

        const response = await fetch(`https://api.spotify.com/v1/search?q=${args.name}&type=artist`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.artists.items[0]
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    fetchArtistsByIds: async (_, args) => {
      try {
        console.log(`debug: query artist ${JSON.stringify(args)} `)

        const response = await fetch(`https://api.spotify.com/v1/artists?ids=${args.ids}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.artists
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
  },
  Artist: {
    albums: async (parent, args) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${parent.id}/albums`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()
        const albums_list = data.items

        return args.limit ? albums_list.splice(0, args.limit) : albums_list
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    followers: async (parent) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()
        const followers = data.followers

        return followers
      } catch (error) {
        throwExceptionOnError(error)
      }
    }
  },
  Album: {
    tracks: async (parent, args) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${parent.id}/tracks`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.items
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    copyrights: async (parent, args) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.copyrights
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    availableMarkets: async (parent, args) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.available_markets
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    label: async (parent) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.label
      } catch (error) {
        throwExceptionOnError(error)
      }
    },
    popularity: async (parent) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.popularity
      } catch (error) {
        throwExceptionOnError(error)
      }
    }
  },
  Track: {
    popularity: async (parent) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${parent.id}`, {
          headers: await haveHeadersWithAuthToken()
        })
        const data = await response.json()

        return data.popularity
      } catch (error) {
        throwExceptionOnError(error)
      }
    }
  }
}

module.exports = resolvers
