const { gql } = require("apollo-server-express");

module.exports = gql`
type User {
  id: String
  display_name: String
  email: String
  href: String
  country: String
  type: String
  uri: String
}

type Query {
    me: User
  }
`

// playlists(limit: Int): [Playlist]
// images: [Image]
// followers: Followers
