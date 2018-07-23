/* global Promise buildQuery query getParticipantRegistry getAssetRegistry getFactory */

const NS = 'org.tbma'

/**
 * log as event
 * @param {String} message
 */
function log(message = '') {
  const logEvent = getFactory().newEvent(NS, 'LogEvent')
  logEvent.message = message
  emit(logEvent)
}

/**
 * emit event money transfer
 * @param {Object} eventData
 */
function emitMoneyTransfer({ from, to, amount, remark }) {
  // emit event
  const transferEvent = getFactory().newEvent(NS, 'MoneyTransferEvent')
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  transferEvent.remark = remark
  emit(transferEvent)
}

/**
 * emit event money transfer
 * @param {Object} eventData
 */
function emitBondTransfer({ bond, from, to, amount, remark }) {
  // emit event
  const transferEvent = getFactory().newEvent(NS, 'BondTransferEvent')
  transferEvent.bond = bond
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  transferEvent.remark = remark
  emit(transferEvent)
}

/**
 *
 * @param {org.tbma.RoleUpdateTransaction} tx
 * @transaction
 */
async function RoleUpdateTransaction(tx) {
  const { account, role, isGrant } = tx

  account.role[role] = isGrant

  // emit event
  const roleUpdateEvent = getFactory().newEvent(NS, 'RoleUpdateEvent')
  roleUpdateEvent.account = account
  roleUpdateEvent.role = role
  roleUpdateEvent.isGrant = isGrant
  emit(roleUpdateEvent)

  const accountRegistry = await getParticipantRegistry(`${NS}.Account`)
  await accountRegistry.update(account)
}

/**
 * transfer money action
 * @param {org.tbma.MoneyMintTransaction} tx
 * @transaction
 */
async function MoneyMintTransaction(tx) {
  const to = tx.to
  const amount = tx.amount

  // emit
  emitMoneyTransfer({ to, amount, remark: 'DEPOSIT' })

  // update
  to.balance += amount

  // commit
  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  await moneyWalletRegistry.update(to)
}

/**
 * transfer money action
 * @param {org.tbma.MoneyBurnTransaction} tx
 * @transaction
 */
async function MoneyBurnTransaction(tx) {
  const from = tx.from
  const amount = tx.amount

  //emit
  emitMoneyTransfer({ from, amount, remark: 'WITHDRAW' })

  // update
  from.balance -= amount

  // commit
  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  await moneyWalletRegistry.update(from)
}

/**
 * transfer money action
 * @param {org.tbma.MoneyTransferTransaction} tx
 * @transaction
 */
async function MoneyTransferTransaction(tx) {
  const from = tx.from
  const to = tx.to
  const amount = tx.amount
  const remark = tx.remark

  if (from.balance < amount) {
    throw new Error('Error: MoneyWallet balance is not enougth')
  }

  // emit event
  emitMoneyTransfer({ from, to, amount, remark })

  // update
  from.balance -= amount
  to.balance += amount

  // commit
  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  await moneyWalletRegistry.updateAll([from, to])
}

/**
 * transfer bond
 * @param {org.tbma.BondMintTransaction} tx
 * @transaction
 */
async function BondMintTransaction(tx) {
  const to = tx.to
  const amount = tx.amount

  const bond = tx.bond || to.bond

  // emit event
  emitBondTransfer({ bond, to, amount, remark: 'MINT' })

  // update
  to.balance += amount
  bond.totalSupply += amount

  // commit to block
  const [bondRegistry, bondWalletRegistry] = await Promise.all([
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondWallet`)
  ])
  await Promise.all([
    bondRegistry.update(bond),
    bondWalletRegistry.update(to)
  ])
}

/**
 * transfer bond
 * @param {org.tbma.BondBurnTransaction} tx
 * @transaction
 */
async function BondBurnTransaction(tx) {
  const from = tx.from
  const amount = tx.amount

  const bond = tx.bond || from.bond

  // emit event
  emitBondTransfer({ bond, from, amount, remark: 'BURN' })

  // update
  from.balance -= amount
  bond.totalSupply -= amount

  // commit to block
  const [bondRegistry, bondWalletRegistry] = await Promise.all([
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondWallet`)
  ])
  await Promise.all([
    bondRegistry.update(bond),
    bondWalletRegistry.update(from)
  ])
}

/**
 * transfer bond
 * @param {org.tbma.BondTransferTransaction} tx
 * @transaction
 */
async function BondTransferTransaction(tx) {
  const from = tx.from
  const to = tx.to
  const bond = to.bond
  const amount = tx.amount
  const remark = tx.remark

  // validation
  if (from.bond.getFullyQualifiedIdentifier() !== to.bond.getFullyQualifiedIdentifier()) {
    throw new Error('Error: wallet and bond is not match')
  }
  if (from.balance < amount) {
    throw new Error('Error: bond balance is not enougth')
  }

  // emit event
  emitBondTransfer({ bond, from, to, amount, remark })

  // update
  from.balance -= amount
  to.balance += amount

  // commit to block
  const bondWalletRegistry = await getAssetRegistry(`${NS}.BondWallet`)
  await bondWalletRegistry.updateAll([from, to])
}

/**
 * subscription bond
 * @param {org.tbma.BondSubscriptionTransaction} tx
 * @transaction
 */
async function BondSubscriptionTransaction(tx) {
  const { subscriptionContract, moneyWallet, bondWallet, amount } = tx
  const { bond, issuerMoneyWallet, isCloseSale, hardCap } = subscriptionContract

  if (isCloseSale) {
    throw new Error('Subscription contract is close sale')
  }

  if (subscriptionContract.soldAmount + amount > hardCap) {
    throw new Error('Subscription are over hard cap')
  }

  if (!subscriptionContract.subscripers) { // prevent array null or undefined
    subscriptionContract.subscripers = []
  }

  const existSubscriper = subscriptionContract.subscripers.find(s => s.wallet.getIdentifier() === bondWallet.getIdentifier())
  if (existSubscriper) { // update case
    existSubscriper.amount += amount
  } else { // new case
    const newSubscriper = getFactory().newConcept(NS, 'Subscriper')
    newSubscriper.wallet = bondWallet
    newSubscriper.amount = amount

    subscriptionContract.subscripers.push(newSubscriper)
  }

  subscriptionContract.soldAmount += amount
  const moneyAmount = bond.parValue * amount

  const bondSubscriptionContractRegistry = await getAssetRegistry(`${NS}.BondSubscriptionContract`)
  await Promise.all([
    bondSubscriptionContractRegistry.update(subscriptionContract),
    MoneyTransferTransaction({
      $class: 'org.tbma.MoneyTransferTransaction',
      from: moneyWallet,
      to: issuerMoneyWallet,
      amount: moneyAmount,
      remark: `PURCHASE:${bond.getFullyQualifiedIdentifier()}`
    }),
  ])
}

/**
 * set subscription contract sale status to close and transfer bond to investor wallet
 * @param {org.tbma.BondSubscriptionCloseSaleTransaction} tx
 * @transaction
 */
async function BondSubscriptionCloseSaleTransaction(tx) {
  const { subscriptionContract } = tx
  const { bond, isCloseSale, subscripers } = subscriptionContract

  if (isCloseSale) {
    throw new Error('Subscription contract is close sale')
  }

  // calculate maturity date
  const maturityDate = new Date(tx.timestamp)
  let matureMonth = maturityDate.getMonth() + bond.issueTerm % 12
  let matuerYear = maturityDate.getFullYear() + bond.issueTerm / 12
  if (matureMonth > 12) {
    matureMonth -= 12
    matuerYear += 1
  }
  maturityDate.setFullYear(matuerYear)
  maturityDate.setMonth(matureMonth)

  bond.maturityDate = maturityDate
  bond.issueDate = tx.timestamp

  subscriptionContract.isCloseSale = true

  const [bondRegistry, bondSubscriptionContractRegistry] = await Promise.all([
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondSubscriptionContract`)
  ])

  await Promise.all([
    bondRegistry.update(bond),
    bondSubscriptionContractRegistry.update(subscriptionContract)
  ])
  for (let index = 0; index < subscripers.length; index++) {
    const subscriper = subscripers[index];
    await BondMintTransaction({
      $class: 'org.tbma.BondMintTransaction',
      to: subscriper.wallet,
      amount: subscriper.amount,
      bond
    })
  }
}

const getBondAge = (issueDate, matureDate) => {
  return Math.abs(issueDate.getTime() - matureDate.getTime()) / 1000 / 60 / 60 / 24 // today
}

const getCouponTime = bond => {
  const age = getBondAge(new Date(bond.issueDate), new Date(bond.maturityDate))
  return Math.floor(age / 365 * bond.paymentFrequency) // TODO
}

const getCouponPerPeriod = bond => {
  return bond.parValue * bond.couponRate / bond.paymentFrequency / 100.0
}

/**
 * emit all coupon payout per year event for bond holder
 * @param {org.tbma.CouponPayoutTransaction} tx
 * @transaction
 */
async function CouponPayoutTransaction(tx) {
  const factory = getFactory()
  const bond = tx.bond
  const issuerMoneyWallet = tx.moneyWallet

  const couponPerPeriod = getCouponPerPeriod(bond)
  const couponPayout = factory.newConcept(NS, 'CouponPayout')
  couponPayout.couponPerUnit = couponPerPeriod
  couponPayout.transactionId = tx.transactionId

  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  const bondWallets = await query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${tx.bond.id}` })
  for (let index = 0; index < bondWallets.length; index++) {
    const bondWallet = bondWallets[index];
    const couponAmount = bondWallet.balance * couponPerPeriod

    const investorCouponWallet = await moneyWalletRegistry.get(bondWallet.couponWallet.getIdentifier())
    await MoneyTransferTransaction({
      '$class': 'org.tbma.MoneyTransferTransaction',
      from: issuerMoneyWallet,
      to: investorCouponWallet,
      amount: couponAmount,
      remark: `COUPON:${bondWallet.getFullyQualifiedIdentifier()}`
    })
  }

  const bondRegistry = await getAssetRegistry(`${NS}.Bond`)
  bond.couponPayout ? bond.couponPayout.push(couponPayout) : bond.couponPayout = [couponPayout]
  await bondRegistry.update(bond)
}

/**
 * buy back bond at maturity date and pay coupon if dont pay
 * @param {org.tbma.BondBuyBackTransaction} tx
 * * @transaction
 */
async function BondBuyBackTransaction(tx) {
  const bond = tx.bond
  const issuerMoneyWallet = tx.moneyWallet

  if (bond.couponPayout.length < getCouponTime(bond)) {
    throw new Error(`Bond missing coupon payout, Bond should payout ${getCouponTime(bond)} time, current ${bond.couponPayout.length}`)
  }

  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  const bondWallets = await query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${tx.bond.id}` })
  for (let index = 0; index < bondWallets.length; index++) {
    const bondWallet = bondWallets[index];
    const buybackAmount = bondWallet.balance * bond.parValue

    const investorCouponWallet = await moneyWalletRegistry.get(bondWallet.couponWallet.getIdentifier())
    await Promise.all([
      MoneyTransferTransaction({
        '$class': 'org.tbma.MoneyTransferTransaction',
        from: issuerMoneyWallet,
        to: investorCouponWallet,
        amount: buybackAmount,
        remark: 'BUYBACK'
      }),
      BondBurnTransaction({
        '$class': 'org.tbma.BondBurnTransaction',
        from: bondWallet,
        amount: bondWallet.balance,
        bond
      })
    ])
  }
}
