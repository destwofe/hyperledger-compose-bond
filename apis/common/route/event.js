const router = require('express').Router()
// const { getSafe } = require('../../utils')

router.get('/', async (req, res) => {
  const { bondNetwork, query: { resolve } } = req
  const events = await bondNetwork.getEvents({ resolve: resolve === 'true' })
  return res.json(events)
})

router.get('/moneytransfer', async (req, res) => {
  const { bondNetwork, query: { moneyWallet, resolve } } = req
  try {
    const events = await bondNetwork.getMoneyTransferEvents({ moneyWallet, resolve: resolve === 'true' })
    return res.json(events)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

router.get('/bondtransfer', async (req, res) => {
  const { bondNetwork, query: { bondWallet, bond, resolve } } = req
  try {
    const events = await bondNetwork.getBondTransferEvents({ bondWallet, bond, resolve: resolve === 'true' })
    return res.json(events)
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

module.exports = router
