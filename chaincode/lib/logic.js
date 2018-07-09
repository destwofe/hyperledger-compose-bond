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
 * @param {org.tbma.MoneyTransferTransaction} tx
 * @transaction
 */
async function MoneyTransferTransaction(tx) {
  const from = tx.from
  const to = tx.to
  const amount = tx.amount
  const remark = tx.remark

  if (from && from.balance < amount) {
    throw new Error('Error: MoneyWallet balance is not enougth')
  }

  // emit event
  const transferEvent = getFactory().newEvent(NS, 'MoneyTransferEvent')
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  transferEvent.remark = remark
  emit(transferEvent)

  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  if (from) {
    from.balance -= amount
    await moneyWalletRegistry.update(from)
  }
  if (to) {
    to.balance += amount
    await moneyWalletRegistry.update(to)
  }
}

/**
 * transfer money action
 * @param {org.tbma.MoneyDepositTransaction} tx
 * @transaction
 */
async function MoneyDepositTransaction(tx) {
  const to = tx.to
  const amount = tx.amount

  await MoneyTransferTransaction({
    $class: 'org.tbma.MoneyTransferTransaction',
    to,
    amount,
    remark: 'DEPOSIT'
  })
}

/**
 * transfer money action
 * @param {org.tbma.MoneyWithdrawTransaction} tx
 * @transaction
 */
async function MoneyWithdrawTransaction(tx) {
  const from = tx.from
  const amount = tx.amount

  await MoneyTransferTransaction({
    $class: 'org.tbma.MoneyTransferTransaction',
    from,
    amount,
    remark: 'WITHDRAW'
  })
}

/**
 * transfer bond
 * @param {org.tbma.BondTransferTransaction} tx
 * @transaction
 */
async function BondTransferTransaction(tx) {
  const from = tx.from
  const to = tx.to
  const amount = tx.amount
  const remark = tx.remark

  const factory = getFactory()

  // validation
  if (from && to && from.bond.getFullyQualifiedIdentifier() !== to.bond.getFullyQualifiedIdentifier()) {
    throw new Error('Error: wallet and bond is not match')
  }
  if (from && from.balance < amount) {
    throw new Error('Error: bond balance is not enougth')
  }

  // emit event
  const transferEvent = factory.newEvent(NS, 'BondTransferEvent')
  transferEvent.bond = from && from.bond || to && to.bond
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  transferEvent.remark = remark
  emit(transferEvent)

  // commit to block
  const bondWalletRegistry = await getAssetRegistry(`${NS}.BondWallet`)

  // operation
  if (from) {
    from.balance -= amount
    await bondWalletRegistry.update(from)
  }
  if (to) {
    to.balance += amount
    await bondWalletRegistry.update(to)
  }
}

/**
 * purchase bond
 * @param {org.tbma.BondPurchaseTransaction} tx
 * @transaction
 */
async function BondPurchaseTransaction(tx) {
  const bond = tx.bond
  const amount = tx.amount
  const moneyWallet = tx.moneyWallet
  const bondWallet = tx.bondWallet
  const issuerMoneyWallet = bond.issuerMoneyWallet

  const factory = getFactory()

  const totalAmount = bond.parValue * amount

  // mint bond for investor
  bond.totalSupply += amount

  const [bondRegistry, bondWalletRegistry] = await Promise.all([
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondWallet`)
  ])

  // commit to block
  await Promise.all([
    MoneyTransferTransaction({
      '$class': 'org.tbma.MoneyTransferTransaction',
      from: moneyWallet,
      to: issuerMoneyWallet,
      amount: totalAmount
    }),
    BondTransferTransaction({
      $class: 'org.tbma.BondTransferTransaction',
      to: bondWallet,
      bond,
      amount,
      remark: 'PURCHASE'
    }),
    bondRegistry.update(bond)
  ])
}

const getBondAge = (issueDate, matureDate) => {
  return Math.abs(issueDate.getTime() - matureDate.getTime()) / 1000 / 60 / 60 / 24 // today
}

const getCouponTime = bond => {
  const age = getBondAge(new Date(bond.issueDate), new Date(bond.maturity))
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
  const bondWallets = await query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${tx.bond.symbol}` })
  await Promise.all(bondWallets.map(async (bondWallet) => {
    const couponAmount = bondWallet.balance * couponPerPeriod

    const investorCouponWallet = await moneyWalletRegistry.get(bondWallet.couponWallet.getIdentifier())
    await MoneyTransferTransaction({
      '$class': 'org.tbma.MoneyTransferTransaction',
      from: issuerMoneyWallet,
      to: investorCouponWallet,
      amount: couponAmount,
      remark: 'COUPON'
    })
  }))

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
  const bondWallets = await query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${tx.bond.symbol}` })
  await Promise.all(bondWallets.map(async (bondWallet) => {
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
      BondTransferTransaction({
        $class: 'org.tbma.BondTransferTransaction',
        bond,
        from: bondWallet,
        amount: bondWallet.balance,
        remark: 'BUYBACK'
      })
    ])
  }))
}
