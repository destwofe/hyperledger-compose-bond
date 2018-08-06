const router = require('express').Router()

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.get('/', async (req, res) => {
  const { bondNetwork, query: { filter, bond, resolve } } = req
  if (filter && filter === 'owner') {
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const bondwallets = await bondNetwork.getBondWalletByOwner({ owner: identifier, resolve })
    return res.json(bondwallets)
  }
  if (filter && filter === 'bond' && bond) {
    const bondwallets = await bondNetwork.getBondWalletByBond({ bond, resolve })
    return res.json(bondwallets)
  }
  const bondwallets = await bondNetwork.getBondWallets({ resolve })
  return res.json(bondwallets)
})

router.get('/:id', async (req, res) => {
  try {
    const { bondNetwork, query: { resolve } } = req
    const bondwallets = await bondNetwork.getBondWallets({ id: req.id, resolve })
    return res.json(bondwallets)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
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

module.exports = router
