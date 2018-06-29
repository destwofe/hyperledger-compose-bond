const router = require('express').Router()
const BondNetwork = require('../BoneNetwork')

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.use('/', (req, res, next) => {
  const resError = (error = 'autorize is required') => res.status(403).json({ error })

  const bondNetwork = new BondNetwork()
  if (!req.headers.accesstoken) return resError()
  return bondNetwork.init(req.headers.accesstoken).then(() => {
    req.bondNetwork = bondNetwork;
    return next();
  }).catch(error => resError(error.toString()))
})

router.get('/account', async (req, res) => {
  try {
    const { bondNetwork } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const account = await bondNetwork.getAccounts(identifier)
    return res.json(account)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/account', async (req, res) => {
  try {
    const { bondNetwork, body: { email, name } } = req
    const response = await bondNetwork.createAccount({ email, name })
    return res.json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/setupDemo', async (req, res) => {
  try {
    const { bondNetwork } = req
    const response = await bondNetwork.setupDemo()
    return res.json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

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

router.post('/bonds', async (req, res) => {
  try {
    const { bondNetwork, body: { symbole, parValue, couponRate, paymentMultipier, paymentPeroid, maturity, issuerMoneyWallet } } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const bond = await bondNetwork.createBond({ symbole, parValue, couponRate, paymentMultipier, paymentPeroid, maturity: new Date(maturity), issuer: identifier, issuerMoneyWallet })

    return res.json(bond)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/bondwallets', async (req, res) => {
  const { bondNetwork, query: { filter, bond } } = req
  if (filter && filter === 'owner') {
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const bondwallets = await bondNetwork.getBondWalletByOwner(identifier)
    return res.json(bondwallets)
  }
  if (filter && filter === 'bond' && bond) {
    const bondwallets = await bondNetwork.getBondWalletByBond(bond)
    return res.json(bondwallets)
  }
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
    const { bondNetwork, body: { bond, couponwallet } } = req
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

router.post('/moneywallets', async (req, res) => {
  try {
    const { bondNetwork } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const moneywallet = await bondNetwork.createMoneyWallet({ owner: identifier })

    return res.json(moneywallet)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/moneytransfer', async (req, res) => {
  try {
    const { bondNetwork, body: { from, to, amount } } = req
    const moneyTransferResponse = await bondNetwork.MoneyTransferTransaction({ from, to, amount })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/bondtransfer', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, from, to, amount } } = req
    const bondTransferResponse = await bondNetwork.BondTransferTransaction({ bond, from, to, amount })
    return res.json(bondTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/bondpurchase', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneywallet, bondwallet, amount } } = req
    const moneyTransferResponse = await bondNetwork.BondPurchaseTransaction({ bond, moneywallet, bondwallet, amount })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/couponpayout', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneyWallet } } = req
    const couponPayoutTransactionResponse = await bondNetwork.CouponPayoutTransaction({ bond, moneyWallet })
    return res.json(couponPayoutTransactionResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
