const { spotifyApi } = require('./api')

module.exports = {
  Query: {
    me: async () => {
      try {
        const getMe = await spotifyApi.getMe()
        return getMe.body
      } catch (error) {
        console.log(error)
      }
    }
  }
}
