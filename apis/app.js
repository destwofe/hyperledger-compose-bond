const logger = require('./common/logger')('app.js')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use(morgan('dev'))

app.use('/api', require('./common/route'))

const PORT = process.env.PORT || 3335
app.listen(PORT, function (err) {
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
