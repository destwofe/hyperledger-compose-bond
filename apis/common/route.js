const router = require('express').Router()
const BondNetwork = require('../BoneNetwork')

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.use('/', (req, res, next) => {
  const resError = () => res.status(403).json({ error: 'autorize is required' })

  const bondNetwork = new BondNetwork()
  if (!req.headers.accesstoken) return resError()

  return bondNetwork.init(req.headers.accesstoken).then(() => {
    req.bondNetwork = bondNetwork;
    return next();
  }).catch(() => resError())
})

// router.post('/setupDemo', (req, res) => {
//   // const bn = new bondNetwork ()
//   // bn.init('admin@bond').then(async () => {
//   //   const setupdemorespose = await bn.setupDemo()
//   //   console.log(setupdemorespose)
//   //   return true
//   // }).catch(console.log)
// })

router.get('/historian', async (req, res) => {
  const { bondNetwork } = req
  const historians = await bondNetwork.getHistorians()
  return res.json(historians)
})

router.get('/events', async (req, res) => {
  const { bondNetwork } = req
  const events = await bondNetwork.getEvents()
  return res.json(events)
})

router.get('/bonds', async (req, res) => {
  const { bondNetwork } = req
  const bonds = await bondNetwork.getBonds()
  return res.json(bonds)
})

router.get('/bonds/:id', async (req, res) => {
  try {
    const { bondNetwork } = req
    const bonds = await bondNetwork.getBonds(req.id)
    return res.json(bonds)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.get('/bondwallets', async (req, res) => {
  const { bondNetwork } = req
  const bondwallets = await bondNetwork.getBondWallets()
  return res.json(bondwallets)
})

router.get('/bondwallets/:id', async (req, res) => {
  try {
    const { bondNetwork } = req
    const bondwallets = await bondNetwork.getBondWallets(req.id)
    return res.json(bondwallets)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.post('/bondwallets', async (req, res) => {
  try {
    const { bondNetwork } = req
    const { bond, couponwallet } = req.body
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const bondWallet = await bondNetwork.createBondWallet({ bond, owner: identifier, couponwallet })

    return res.json(bondWallet)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/moneywallets', async (req, res) => {
  const { bondNetwork } = req
  const moneywallets = await bondNetwork.getMoneyWallets()
  return res.json(moneywallets)
})

router.get('/moneywallets/:id', async (req, res) => {
  try {
    const { bondNetwork } = req
    const moneywallets = await bondNetwork.getMoneyWallets(req.id)
    return res.json(moneywallets)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

module.exports = router
