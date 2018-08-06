const router = require('express').Router()
const { getSafe } = require('../../utils')

router.get('/', async (req, res) => {
  const { bondNetwork, query: { transactionIDs } } = req
  const inArr = getSafe(() => JSON.parse(transactionIDs)) || []
  const transactions = inArr.length > 0
    ? await Promise.all(inArr.map(transactionId => bondNetwork.getHistorians({ id: transactionId })))
    : await bondNetwork.getHistorians({})
  return res.json(transactions)
})

router.post('/moneytransfer', async (req, res) => {
  try {
    const { bondNetwork, body: { from, to, amount } } = req
    const moneyTransferResponse = await bondNetwork.MoneyTransferTransaction({ from, to, amount })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/moneydeposit', async (req, res) => {
  try {
    const { bondNetwork, body: { to, amount } } = req
    const moneyDepositResponse = await bondNetwork.MoneyDepositTransaction({ to, amount })
    return res.json(moneyDepositResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/moneywithdraw', async (req, res) => {
  try {
    const { bondNetwork, body: { from, amount } } = req
    const moneyWithdrawResponse = await bondNetwork.MoneyWithdrawTransaction({ from, amount })
    return res.json(moneyWithdrawResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/bondtransfer', async (req, res) => {
  try {
    const { bondNetwork, body: { from, to, amount } } = req
    const bondTransferResponse = await bondNetwork.BondTransferTransaction({ from, to, amount })
    return res.json(bondTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/bondsubscription', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneyWallet, bondWallet, amount } } = req
    const moneyTransferResponse = await bondNetwork.BondSubscriptionTransaction({ bond, moneyWallet, bondWallet, amount })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/bondsubscriptionclosesale', async (req, res) => {
  try {
    const { bondNetwork, body: { bond } } = req
    const moneyTransferResponse = await bondNetwork.BondSubscriptionCloseSaleTransaction({ bond })
    return res.json(moneyTransferResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


router.post('/couponsnap', async (req, res) => {
  try {
    const { bondNetwork, body: { bond } } = req
    const CouponSnapTransactionResponse = await bondNetwork.CouponSnapTransaction({ bond })
    return res.json(CouponSnapTransactionResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/couponpayout', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneyWallet, couponPayoutIndex } } = req
    const couponPayoutTransactionResponse = await bondNetwork.CouponPayoutTransaction({ bond, moneyWallet, couponPayoutIndex })
    return res.json(couponPayoutTransactionResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/buyback', async (req, res) => {
  try {
    const { bondNetwork, body: { bond, moneyWallet } } = req
    const couponPayoutTransactionResponse = await bondNetwork.BondBuyBackTransaction({ bond, moneyWallet })
    return res.json(couponPayoutTransactionResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
