const router = require('express').Router()

router.get('/bonds', async (req, res) => {
  try {
    const { bondNetwork } = req
    const [bonds, bondWallets, moneyWallets] = await Promise.all([
      bondNetwork.getBonds({ resolve: true }),
      bondNetwork.getBondWallets({ resolve: true }),
      bondNetwork.getMoneyWallets({ resolve: true }),
    ])
    res.json({ bonds, bondWallets, moneyWallets })
  } catch (error) {
    res.status(403).json(error)
  }
})

router.get('/bondwallets', async (req, res) => {
  try {
    const { bondNetwork } = req
    const [bondWallets, bondTransferEvents] = await Promise.all([
      bondNetwork.getBondWallets({ resolve: true }),
      bondNetwork.getBondTransferEvents({ resolve: true }),
    ])
    res.json({ bondWallets, bondTransferEvents })
  } catch (error) {
    res.status(403).json(error)
  }
})

router.get('/moneywallets', async (req, res) => {
  try {
    const { bondNetwork } = req
    const [moneyWallets, moneyTransferEvents] = await Promise.all([
      bondNetwork.getMoneyWallets({ resolve: true }),
      bondNetwork.getMoneyTransferEvents({ resolve: true }),
    ])
    res.json({ moneyWallets, moneyTransferEvents })
  } catch (error) {
    res.status(403).json(error)
  }
})

module.exports = router
