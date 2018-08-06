const router = require('express').Router()
const BondNetwork = require('../../BondNetwork')

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.use('/', (req, res, next) => {
  const resError = (error = 'autorize is required') => res.status(403).json({ error })

  const bondNetwork = new BondNetwork()
  if (!req.headers.authorization) return resError()
  return bondNetwork.init(req.headers.authorization.replace('Bearer ', '')).then(() => {
    req.bondNetwork = bondNetwork;
    return next();
  }).catch(error => resError(error.toString()))
})

router.use('/accounts', require('./account'))
router.use('/bonds', require('./bond'))
router.use('/moneywallets', require('./moneywallet'))
router.use('/bondwallets', require('./bondwallet'))
router.use('/transaction', require('./transaction'))
router.use('/events', require('./event'))
router.use('/graph', require('./graph'))

module.exports = router
