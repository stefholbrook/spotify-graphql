const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressGraphQL = require('express-graphql')

const schema = require('./app/schema.js')

const app = express()
const router = express.Router()

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Spotify Graphql Server' })
// })

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// app.use('/', routes)

const rootValue = { hi: () => 'Hello world!' }

module.exports = app
