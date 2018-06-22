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
  issuer.balance = 1000000000

  // create investors
  const investorA = factory.newResource(NS, 'Account', 'investorA@email.com')
  investorA.name = 'Investor A'
  investorA.balance = 3000000

  const investorB = factory.newResource(NS, 'Account', 'investorB@email.com')
  investorB.name = 'Investor A'
  investorB.balance = 5000000

  const investorC = factory.newResource(NS, 'Account', 'investorC@email.com')
  investorC.name = 'Investor A'
  investorC.balance = 6000000

  // create bond
  const bond = factory.newResource(NS, 'Bond', 'THB001A')
  const paymentFrequency = factory.newConcept(NS, 'PaymentFrequency')
  paymentFrequency.periodMultipier = 1
  paymentFrequency.period = 'YEAR'
  bond.parValue = 1000
  bond.couponRate = 3.8
  bond.paymentFrequency = paymentFrequency
  bond.maturity = new Date(2019, 6, 19)
  bond.totalSupply = 1000000
  bond.issuer = factory.newRelationship(NS, 'Account', 'issuerA@email.com')

  // create bond wallet
  const issuerWallet = factory.newResource(NS, 'BondWallet', 'THB001A-issuerA@email.com')
  issuerWallet.bond = factory.newRelationship(NS, 'Bond', 'THB001A')
  issuerWallet.account = factory.newRelationship(NS, 'Account', 'issuerA@email.com')
  issuerWallet.amount = bond.totalSupply

  const investorAWallet = factory.newResource(NS, 'BondWallet', 'THB001A-investorA@email.com')
  investorAWallet.bond = factory.newRelationship(NS, 'Bond', 'THB001A')
  investorAWallet.account = factory.newRelationship(NS, 'Account', 'investorA@email.com')
  investorAWallet.amount = 0

  const investorBWallet = factory.newResource(NS, 'BondWallet', 'THB001A-investorB@email.com')
  investorBWallet.bond = factory.newRelationship(NS, 'Bond', 'THB001A')
  investorBWallet.account = factory.newRelationship(NS, 'Account', 'investorB@email.com')
  investorBWallet.amount = 0

  const investorCWallet = factory.newResource(NS, 'BondWallet', 'THB001A-investorC@email.com')
  investorCWallet.bond = factory.newRelationship(NS, 'Bond', 'THB001A')
  investorCWallet.account = factory.newRelationship(NS, 'Account', 'investorC@email.com')
  investorCWallet.amount = 0

  // commit to block
  const [accountRegistry, bondRegistry, bondWalletRegistry] = await Promise.all([
    getParticipantRegistry(`${NS}.Account`),
    getAssetRegistry(`${NS}.Bond`),
    getAssetRegistry(`${NS}.BondWallet`),
  ])

  await Promise.all([
    accountRegistry.addAll([issuer, investorA, investorB, investorC]),
    bondRegistry.addAll([bond]),
    bondWalletRegistry.addAll([issuerWallet, investorAWallet, investorBWallet, investorCWallet])
  ])
}

/**
 * transfer money action
 * @param {*} tx
 */
async function moneyTransfer(tx) {
  if (tx.from.balance < tx.amount) {
    throw new Error('Error: Account balance is not enougth')
  }

  // emit event
  const transferEvent = getFactory().newEvent(NS, 'MoneyTransferEvent')
  transferEvent.from = tx.from
  transferEvent.to = tx.to
  transferEvent.amount = tx.amount
  emit(transferEvent)

  tx.from.balance -= tx.amount
  tx.to.balance += tx.amount

  const accountRegistry = await getParticipantRegistry(`${NS}.Account`)
  await accountRegistry.updateAll([tx.from, tx.to])
}

/**
 * transfer bond action
 * @param {*} tx
 */
async function bondTransfer(tx) {
  const factory = getFactory()

  // validation
  if (tx.bond.getFullyQualifiedIdentifier() !== tx.from.bond.getFullyQualifiedIdentifier() || tx.bond.getFullyQualifiedIdentifier()  !== tx.to.bond.getFullyQualifiedIdentifier()) {
    throw new Error('wallet and bond is not match')
  }
  if (tx.from.amount < tx.amount) {
    throw new Error('bond balance is not enougth')
  }

  // operation
  tx.from.amount -= tx.amount
  tx.to.amount += tx.amount

  // emit event
  const transferEvent = factory.newEvent(NS, 'BondTransferEvent')
  transferEvent.bond = tx.bond
  transferEvent.from = tx.from
  transferEvent.to = tx.to
  transferEvent.amount = tx.amount
  emit(transferEvent)

  // commit to block
  const bondWalletRegistry = await getAssetRegistry(`${NS}.BondWallet`)

  await Promise.all([
    bondWalletRegistry.update(tx.from),
    bondWalletRegistry.update(tx.to),
  ])
}

/**
 * transfer bond
 * @param {org.tbma.BondTransfer} tx
 * @transaction
 */
async function bondTransferTransaction(tx) {
  const from = tx.from
  const bond = tx.bond
  const to = tx.to
  const amount = tx.amount

  // const fromWallet = (await query('bondWalletByHolder', { bond: `resource:org.tbma.Bond#${bond.symbole}`, account: `resource:org.tbma.Account#${from.email}` }))[0]
  // if (!fromWallet) {
  //   throw new Error('Account wallet is not found')
  // }

  await bondTransfer({bond, to, from, amount})
}

/**
 * purchase bond
 * @param {org.tbma.Purchase} tx
 * @transaction
 */
async function purchase(tx) {
  const factory = getFactory()
  // TODO
  // const investor = tx.participantInvoking
  const investor = tx.investor
  const issuer = tx.bond.issuer
  const bond = tx.bond
  const amount = tx.amount

  const totalAmount = bond.parValue * amount

  let [issuerWallet, investorWallet] = await Promise.all([
    (await query('bondWalletByHolder', { bond: `resource:org.tbma.Bond#${bond.symbole}`, account: `resource:org.tbma.Account#${issuer.email}` }))[0],
    (await query('bondWalletByHolder', { bond: `resource:org.tbma.Bond#${bond.symbole}`, account: `resource:org.tbma.Account#${investor.email}` }))[0]
  ])

  if (!investorWallet) {
    const investorWallet = factory.newResource(NS, 'BondWallet', `${bond.symbole}-${investor.email}`)
    investorWallet.bond = factory.newRelationship(NS, 'Bond', `${bond.symbole}`)
    investorWallet.account = factory.newRelationship(NS, 'Account', `${investor.email}`)
    investorWallet.amount = 0
  }

  // commit to block
  await Promise.all([
    moneyTransfer({ from: investor, to: issuer, amount: totalAmount }),
    bondTransfer({ bond, from: issuerWallet, to: investorWallet, amount })
  ])
}

/**
 * emit all coupon payout per year event for bond holder
 * @param {org.tbma.CouponPayout} tx
 * @transaction
 */
async function couponPayout(tx) {
  const factory = getFactory()
  const serializer = getSerializer()
  const logEvent = factory.newEvent(NS, 'LogEvent')

  const bondWallets = await query('queryBondHolderByBond', { bond: `resource:org.tbma.Bond#${tx.bond.symbole}` })
  await Promise.all(bondWallets.map(async (bondWallet) => {
    const bond = tx.bond
    const accountRegistry = await getParticipantRegistry(`${NS}.Account`)
    const account = await accountRegistry.get(bondWallet.account.getIdentifier())

    if (account.email !== bond.issuer.email) {
      // emit coupon amount
      const couponAmount = bondWallet.amount * bond.parValue * bond.couponRate / 100.0
      if (couponAmount > 0) {
        const couponPayoutEvent = factory.newEvent(NS, 'CouponPayOutEvent')
        couponPayoutEvent.bond = tx.bond
        couponPayoutEvent.account = bondWallet.account
        couponPayoutEvent.amount = couponAmount
        emit(couponPayoutEvent)

        await moneyTransfer({from: bond.issuer, to: account, amount: couponAmount})
      }
    }
  }))
}
