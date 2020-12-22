const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql(`
  type Image {
    height: Int
    width: Int
    url: String
  }

  type Playlist {
    id: String
    name: String
    collaborative: Boolean
    images: [Image]
    description: String
    href: String
    public: Boolean
    type: String
    tracks(limit: Int): [Track]
  }

  type Artist {
    id: String
    name: String
    href: String
    genres: [String]
    albums(limit: Int): [Album]
    popularity: Int
    followers: Followers
  }

  type Album {
    id: String
    name: String
    artists: [Artist]
    tracks(limit: Int): [Track]
    popularity: Int
    followers: Followers
    href: String
    images: [Image]
    release_date: String
    label: String
  }

  type Track {
    id: String
    name: String
    duration_ms: Int
    popularity: Int
    track_number: Int
    artists: [Artist]
    album: Album
  }

  type Followers {
    href: String
    total: Int
  }

  # The root of all queries:
  type Query {
    # Just returns "Hello world!"
    hi(message: String = "Hi"): String
    fetchArtistById(id: String, name: String): Artist
  }
`)

module.exports = typeDefs
