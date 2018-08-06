const router = require('express').Router()

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.get('/', async (req, res) => {
  const { bondNetwork, query: { resolve } } = req
  const moneywallets = await bondNetwork.getMoneyWallets({ resolve })
  return res.json(moneywallets)
})

router.get('/:id', async (req, res) => {
  try {
    const { bondNetwork, query: { resolve } } = req
    const moneywallets = await bondNetwork.getMoneyWallets({ id: req.id, resolve })
    return res.json(moneywallets)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
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

module.exports = router
