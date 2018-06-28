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
 * setup demo participant and asset
 * @param {org.tbma.SetupDemo} setupDemo
 * @transaction
 */
async function setupDemo(setupDemo) {
  const factory = getFactory()

  // create issue
  const issuer = factory.newResource(NS, 'Account', 'issuerA@email.com')
  issuer.name = 'Issuer A'

  // create investors
  const investorA = factory.newResource(NS, 'Account', 'investorA@email.com')
  investorA.name = 'Investor A'

  const investorB = factory.newResource(NS, 'Account', 'investorB@email.com')
  investorB.name = 'Investor A'

  const investorC = factory.newResource(NS, 'Account', 'investorC@email.com')
  investorC.name = 'Investor A'

  // create money wallet
  const issuerAMoneyWallet = factory.newResource(NS, 'MoneyWallet', 'issuerAMoneyWallet')
  issuerAMoneyWallet.owner = factory.newRelationship(NS, 'Account', 'issuerA@email.com')
  issuerAMoneyWallet.balance = 100000000

  const investorAMoneyWallet = factory.newResource(NS, 'MoneyWallet', 'investorAMoneyWallet')
  investorAMoneyWallet.owner = factory.newRelationship(NS, 'Account', 'investorA@email.com')
  investorAMoneyWallet.balance = 50000000

  const investorBMoneyWallet = factory.newResource(NS, 'MoneyWallet', 'investorBMoneyWallet')
  investorBMoneyWallet.owner = factory.newRelationship(NS, 'Account', 'investorB@email.com')
  investorBMoneyWallet.balance = 40000000

  const investorCMoneyWallet = factory.newResource(NS, 'MoneyWallet', 'investorCMoneyWallet')
  investorCMoneyWallet.owner = factory.newRelationship(NS, 'Account', 'investorC@email.com')
  investorCMoneyWallet.balance = 200000000

  // create bond
  const bond = factory.newResource(NS, 'Bond', 'THB001A')
  const paymentFrequency = factory.newConcept(NS, 'PaymentFrequency')
  paymentFrequency.periodMultipier = 1
  paymentFrequency.period = 'YEAR'
  bond.parValue = 1000
  bond.couponRate = 3.8
  bond.paymentFrequency = paymentFrequency
  bond.maturity = new Date(2019, 6, 19)
  bond.totalSupply = 0
  bond.issuer = issuer
  bond.issuerMoneyWallet = issuerAMoneyWallet

  // commit to block
  const [accountRegistry, bondRegistry, moneyWalletRegistry] = await Promise.all([
    getParticipantRegistry(`${NS}.Account`),
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.MoneyWallet`)
  ])

  await Promise.all([
    accountRegistry.addAll([issuer, investorA, investorB, investorC]),
    bondRegistry.addAll([bond]),
    moneyWalletRegistry.addAll([issuerAMoneyWallet, investorAMoneyWallet, investorBMoneyWallet, investorCMoneyWallet])
  ])
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

  if (from.balance < amount) {
    throw new Error('Error: MoneyWallet balance is not enougth')
  }

  // emit event
  const transferEvent = getFactory().newEvent(NS, 'MoneyTransferEvent')
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  emit(transferEvent)

  from.balance -= amount
  to.balance += amount

  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  await moneyWalletRegistry.updateAll([
    from,
    to
  ])
}

/**
 * transfer bond
 * @param {org.tbma.BondTransferTransaction} tx
 * @transaction
 */
async function BondTransferTransaction(tx) {
  const from = tx.from
  const bond = tx.bond
  const to = tx.to
  const amount = tx.amount

  const factory = getFactory()

  // validation
  if (bond.getFullyQualifiedIdentifier() !== from.bond.getFullyQualifiedIdentifier() || bond.getFullyQualifiedIdentifier()  !== to.bond.getFullyQualifiedIdentifier()) {
    throw new Error('Error: wallet and bond is not match')
  }
  if (from.balance < amount) {
    throw new Error('Error: bond balance is not enougth')
  }

  // operation
  from.balance -= amount
  to.balance += amount

  // emit event
  const transferEvent = factory.newEvent(NS, 'BondTransferEvent')
  transferEvent.bond = bond
  transferEvent.from = from
  transferEvent.to = to
  transferEvent.amount = amount
  emit(transferEvent)

  // commit to block
  const bondWalletRegistry = await getAssetRegistry(`${NS}.BondWallet`)

  await Promise.all([
    bondWalletRegistry.update(from),
    bondWalletRegistry.update(to),
  ])
}

/**
 * purchase bond
 * @param {org.tbma.BondPurchaseTransaction} tx
 * @transaction
 */
async function BondPurchaseTransaction(tx) {
  const bond = tx.bond
  const amount = tx.amount
  const investorMoneyWallet = tx.investorMoneyWallet
  const investorBondWallet = tx.investorBondWallet
  const issuerMoneyWallet = bond.issuerMoneyWallet
  const investor = investorBondWallet.owner

  const factory = getFactory()

  const totalAmount = bond.parValue * amount

  // mint bond for investor
  bond.totalSupply += amount
  investorBondWallet.balance += amount

  // emit event
  const bondPurchaseEvent = factory.newEvent(NS, 'BondPurchaseEvent')
  bondPurchaseEvent.bond = bond
  bondPurchaseEvent.investor = investor
  bondPurchaseEvent.amount = amount
  emit(bondPurchaseEvent)

  const [bondRegistry, bondWalletRegistry] = await Promise.all([
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondWallet`)
  ])

  // commit to block
  await Promise.all([
    MoneyTransferTransaction({
      '$class': 'org.tbma.MoneyTransferTransaction',
      from: investorMoneyWallet,
      to: issuerMoneyWallet,
      amount: totalAmount
    }),
    bondRegistry.update(bond),
    bondWalletRegistry.update(investorBondWallet)
  ])
}

/**
 * emit all coupon payout per year event for bond holder
 * @param {org.tbma.CouponPayoutTransaction} tx
 * @transaction
 */
async function CouponPayoutTransaction(tx) {
  const factory = getFactory()

  const moneyWalletRegistry = await getAssetRegistry(`${NS}.MoneyWallet`)
  const bondWallets = await query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${tx.bond.symbole}` })
  await Promise.all(bondWallets.map(async (bondWallet) => {
    const bond = tx.bond
    const issuerMoneyWallet = tx.moneyWallet
    const couponAmount = bondWallet.balance * bond.parValue * bond.couponRate / 100.0

    // emit event
    const couponPayoutEvent = factory.newEvent(NS, 'CouponPayOutEvent')
    couponPayoutEvent.bond = tx.bond
    couponPayoutEvent.account = bondWallet.owner
    couponPayoutEvent.amount = couponAmount
    emit(couponPayoutEvent)

    const investorCouponWallet = await moneyWalletRegistry.get(bondWallet.couponWallet.getIdentifier())
    await MoneyTransferTransaction({
      '$class': 'org.tbma.MoneyTransferTransaction',
      from: issuerMoneyWallet,
      to: investorCouponWallet,
      amount: couponAmount
    })
  }))
}
