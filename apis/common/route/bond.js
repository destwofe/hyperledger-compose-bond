const router = require('express').Router()

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.get('/', async (req, res) => {
  const { bondNetwork, query: { resolve } } = req
  const bonds = await bondNetwork.getBonds({ resolve: resolve === 'true' })
  return res.json(bonds)
})

router.get('/:id', async (req, res) => {
  try {
    const { bondNetwork, query: { resolve } } = req
    const bonds = await bondNetwork.getBonds({ id: req.id, resolve: resolve === 'true' })
    return res.json(bonds)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { bondNetwork, body: { symbol, parValue, couponRate, paymentFrequency, issueTerm, hardCap, issuerMoneyWallet } } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier

    const { bond } = await bondNetwork.createBond({
      symbol,
      parValue: Number(parValue),
      couponRate: Number(couponRate),
      paymentFrequency: Number(paymentFrequency),
      issuer: identifier,
      issueTerm: Number(issueTerm),
      hardCap: Number(hardCap),
      issuerMoneyWallet,
    })

    return res.json({ bond })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
