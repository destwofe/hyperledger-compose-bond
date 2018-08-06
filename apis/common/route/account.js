const router = require('express').Router()

router.param('id', (req, res, next, id) => {
  req.id = id
  next()
})

router.get('/', async (req, res) => {
  try {
    const { bondNetwork } = req
    const identity = await bondNetwork.getCardParticipantIdentity()
    const identifier = identity.participant.$identifier
    const account = await bondNetwork.getAccounts({ id: identifier })
    return res.json(account)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { bondNetwork } = req
    const account = await bondNetwork.getAccounts({ id: req.id, resolve: true })
    return res.json(account)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { bondNetwork, body: { id, name, isIssuer, isInvestor, isGateway } } = req
    const response = await bondNetwork.createAccount({ id, name, isIssuer: Boolean(isIssuer), isInvestor: Boolean(isInvestor), isGateway: Boolean(isGateway) })
    return res.json(response)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
