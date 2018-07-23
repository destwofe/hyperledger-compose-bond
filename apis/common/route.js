const router = require('express').Router()
const BondNetwork = require('../BondNetwork')
const { getSafe } = require('../utils')

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
    const { bondNetwork, body: { id, name, isIssuer, isInvestor, isGateway } } = req
    const response = await bondNetwork.createAccount({ id, name, isIssuer: Boolean(isIssuer), isInvestor: Boolean(isInvestor), isGateway: Boolean(isGateway) })
    return res.json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/historians', async (req, res) => {
  const { bondNetwork, query: { transactionIDs } } = req
  const inArr = getSafe(() => JSON.parse(transactionIDs)) || []
  const historians = inArr.length > 0
    ? await Promise.all(inArr.map(transactionId => bondNetwork.getHistorians(transactionId)))
    : await bondNetwork.getHistorians()
  return res.json(historians)
})

router.get('/events', async (req, res) => {
  const { bondNetwork } = req
  const events = await bondNetwork.getEvents()
  return res.json(events)
})

router.get('/events/moneytransfer', async (req, res) => {
  const { bondNetwork, query: { moneyWallet } } = req
  try {
    const events = await bondNetwork.getMoneyTransferEvents({ moneyWallet })
    return res.json(events)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.get('/events/bondtransfer', async (req, res) => {
  const { bondNetwork, query: { bondWallet, bond } } = req
  try {
    const events = await bondNetwork.getBondTransferEvents({ bondWallet, bond })
    return res.json(events)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.get('/bonds', async (req, res) => {
  const { bondNetwork } = req
  const bonds = await bondNetwork.getBonds()
  return res.json(bonds)
})

router.get('/bondSubscriptionContracts', async (req, res) => {
  try {
    const { bondNetwork, query: { isCloseSale, bondId } } = req
    const bondSubscriptionContract = await bondNetwork.getBondSubscriptionContract()
    let filtered = bondSubscriptionContract
    if (isCloseSale != null) filtered = filtered.filter(a => (isCloseSale === 'true') === a.isCloseSale)
    if (bondId != null) filtered = filtered.filter(a => a.bond.id === bondId)
    return res.json(filtered)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.get('/bondSubscriptionContracts/:id', async (req, res) => {
  try {
    const { bondNetwork } = req
    const bondSubscriptionContract = await bondNetwork.getBondSubscriptionContract(req.id)
    return res.json(bondSubscriptionContract)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
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

router.post('/issueBond', async (req, res) => {
  try {
    const { bondNetwork, body: { symbol, parValue, couponRate, paymentFrequency, issueTerm, hardCap, issuerMoneyWallet } } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier

    const { bond } = await bondNetwork.createBond({ symbol, parValue: Number(parValue), couponRate: Number(couponRate), paymentFrequency: Number(paymentFrequency), issuer: identifier, issueTerm: Number(issueTerm) })
    const { bondSubscriptionContract } = await bondNetwork.createBondSubscriptionContract({ bond: bond.id, hardCap, issuerMoneyWallet })

    return res.json({ bond, bondSubscriptionContract })
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
    const { bondNetwork, body: { bond, couponWallet } } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const bondWallet = await bondNetwork.createBondWallet({ bond, owner: identifier, couponWallet })

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

router.post('/transaction/moneydeposit', async (req, res) => {
  try {
    const { bondNetwork, body: { to, amount } } = req
    const moneyDepositResponse = await bondNetwork.MoneyDepositTransaction({ to, amount })
    return res.json(moneyDepositResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/moneywithdraw', async (req, res) => {
  try {
    const { bondNetwork, body: { from, amount } } = req
    const moneyWithdrawResponse = await bondNetwork.MoneyWithdrawTransaction({ from, amount })
    return res.json(moneyWithdrawResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/bondtransfer', async (req, res) => {
  try {
    const { bondNetwork, body: { from, to, amount } } = req
    const bondTransferResponse = await bondNetwork.BondTransferTransaction({ from, to, amount })
    return res.json(bondTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/bondsubscription', async (req, res) => {
  try {
    const { bondNetwork, body: { subscriptionContract, moneyWallet, bondWallet, amount } } = req
    const moneyTransferResponse = await bondNetwork.BondSubscriptionTransaction({ subscriptionContract, moneyWallet, bondWallet, amount })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/transaction/bondsubscriptionclosesale', async (req, res) => {
  try {
    const { bondNetwork, body: { subscriptionContract } } = req
    const moneyTransferResponse = await bondNetwork.BondSubscriptionCloseSaleTransaction({ subscriptionContract })
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

router.post('/transaction/buyback', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneyWallet } } = req
    const couponPayoutTransactionResponse = await bondNetwork.BondBuyBackTransaction({ bond, moneyWallet })
    return res.json(couponPayoutTransactionResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
