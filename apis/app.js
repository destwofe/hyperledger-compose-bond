const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const logger = require('./common/logger')('app.js')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use(morgan('dev'))

app.use('/api', require('./common/route'))


/**
 * Routes REACT
 */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/build/index.html')))
app.use(express.static('build'))

const PORT = process.env.PORT || 3335
app.listen(PORT, (err) => {
  if (err) { return }
  logger.info(`server listern on ${PORT}`)
})

// // create bond network connection instance
// const BondNetwork = require('./BoneNetwork')
// const bondNetwork = new BondNetwork ()
// bondNetwork.init('admin@bond').then(() => {
//   module.exports.bondNetwork = bondNetwork
//   logger.info('Bond network connected')
// })
