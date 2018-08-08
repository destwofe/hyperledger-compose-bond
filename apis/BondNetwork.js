const { BusinessNetworkConnection } = require('composer-client')
const uuidv4 = require('uuid/v4')

const { getSafe } = require('./utils')

const argsIsExist = (...args) => {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === null || arg === undefined) return false
  }
  return true
}

/**
 * bond network connection to hyperledger fabric
 */
class BondNetwork {
  /**
   * constructor
   */
  constructor() {
    this.connection = new BusinessNetworkConnection()
    this.NS = 'org.tbma'
  }

  /**
   * initialize with cardName
   * @param {*} cardName
   */
  async init(cardName = 'admin@bond') {
    this.cardName = cardName
    this.definition = await this.connection.connect(cardName)
    this.serializer = this.definition.getSerializer()
    this.factory = this.definition.getFactory()
  }

  async getCardParticipantIdentity() {
    const identityRegistry = await this.connection.getIdentityRegistry()
    const identities = await identityRegistry.getAll() // TODO
    const cardName = this.connection.getCard().metadata.userName
    const identity = identities.filter(x => x.name === cardName)[0]
    return identity // .participant['$identifier']
  }

  /**
   * submit transaction to block
   * @param {Object} json - transction json object
   */
  async submitTransaction(json) {
    try {
      console.log(json)
      const resource = this.serializer.fromJSON(json)
      await this.connection.submitTransaction(resource)
      return Promise.resolve({ success: true })
    } catch (error) {
      console.log(error)
      return Promise.reject(new Error(error.toString()))
    }
  }

  async query(queryString, queryData) {
    const query = this.connection.buildQuery(queryString, queryData)
    return this.connection.query(query)
  }

  async RoleUpdateTransaction({ account, role, isGrant }) {
    return this.submitTransaction({
      $class: 'org.tbma.RoleUpdateTransaction',
      account: `resource:org.tbma.MoneyWallet#${account}`,
      role,
      isGrant,
    })
  }

  async MoneyTransferTransaction({ from, to, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyTransferTransaction',
      from: `resource:org.tbma.MoneyWallet#${from}`,
      to: `resource:org.tbma.MoneyWallet#${to}`,
      amount,
    })
  }

  async BondTransferTransaction({ from, to, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondTransferTransaction',
      from: `resource:org.tbma.BondWallet#${from}`,
      to: `resource:org.tbma.BondWallet#${to}`,
      amount,
    })
  }

  async BondSubscriptionTransaction({ bond, moneyWallet, bondWallet, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondSubscriptionTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      bondWallet: `resource:org.tbma.BondWallet#${bondWallet}`,
      moneyWallet: `resource:org.tbma.MoneyWallet#${moneyWallet}`,
      amount,
    })
  }

  async BondSubscriptionCloseSaleTransaction({ bond }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondSubscriptionCloseSaleTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
    })
  }

  async CouponSnapTransaction({ bond }) {
    return this.submitTransaction({
      $class: 'org.tbma.CouponSnapTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
    })
  }

  async CouponPayoutTransaction({ moneyWallet, bond, couponPayoutIndex }) {
    return this.submitTransaction({
      $class: 'org.tbma.CouponPayoutTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      moneyWallet: `resource:org.tbma.MoneyWallet#${moneyWallet}`,
      couponPayoutIndex,
    })
  }

  async BondBuyBackTransaction({ moneyWallet, bond }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondBuyBackTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      moneyWallet: `resource:org.tbma.MoneyWallet#${moneyWallet}`,
    })
  }

  async MoneyDepositTransaction({ to, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyMintTransaction',
      to: `resource:org.tbma.MoneyWallet#${to}`,
      amount,
    })
  }

  async MoneyWithdrawTransaction({ from, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyBurnTransaction',
      from: `resource:org.tbma.MoneyWallet#${from}`,
      amount,
    })
  }

  async getHistorians({ id = null, resolve = false }) {
    try {
      const historianRegistry = await this.connection.getHistorian()
      if (id && resolve) return historianRegistry.resolve(id)
      if (id) return historianRegistry.get(id)
      if (resolve) return historianRegistry.resolveAll()
      return historianRegistry.getAll()
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  // async getEvents(eventName) {
  async getEvents({ resolve = false }) {
    try {
      const historians = await this.getHistorians({ resolve })
      return [].concat(...historians.map(a => a.eventsEmitted))
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getMoneyTransferEvents({ moneyWallet, resolve = false }) {
    try {
      if (resolve) {
        let events = (await this.getEvents({ resolve })).filter(a => a.$class === 'org.tbma.MoneyTransferEvent')
        if (moneyWallet) events = events.filter(event => getSafe(() => event.from.id) === moneyWallet || getSafe(() => event.to.id) === moneyWallet)
        return events
      }
      let events = (await this.getEvents({ resolve })).map(a => this.serializer.toJSON(a)).filter(a => a.$class === 'org.tbma.MoneyTransferEvent')
      if (moneyWallet) events = events.filter(a => (a.from === `resource:org.tbma.MoneyWallet#${moneyWallet}` || a.to === `resource:org.tbma.MoneyWallet#${moneyWallet}`))
      return events
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getBondTransferEvents({ bondWallet, bond, resolve = false }) {
    try {
      if (resolve) {
        let events = (await this.getEvents({ resolve })).filter(a => a.$class === 'org.tbma.BondTransferEvent')
        if (bondWallet) events = events.filter(a => getSafe(() => a.from.id) === bondWallet || getSafe(() => a.to.id) === bondWallet)
        if (bond) events = events.filter(a => a.bond.id === bond)
        return events
      }
      let events = (await this.getEvents({ resolve: false })).map(a => this.serializer.toJSON(a)).filter(a => a.$class === 'org.tbma.BondTransferEvent')
      if (bondWallet) events = events.filter(a => (a.from === `resource:org.tbma.BondWallet#${bondWallet}` || a.to === `resource:org.tbma.BondWallet#${bondWallet}`))
      if (bond) events = events.filter(a => (a.bond === `resource:org.tbma.Bond#${bond}`))
      return events
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAccounts({ id, resolve }) {
    try {
      const accountRegistry = await this.connection.getParticipantRegistry(`${this.NS}.Account`)
      if (id && resolve && await accountRegistry.exists(id)) return accountRegistry.resolve(id)
      if (id && await accountRegistry.exists(id)) return accountRegistry.get(id)
      if (resolve) return accountRegistry.resolveAll()
      return accountRegistry.getAll()
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBonds({ id, resolve = false }) {
    try {
      const bondRegistry = await this.connection.getAssetRegistry(`${this.NS}.Bond`)
      if (id && resolve && await bondRegistry.exists(id)) return bondRegistry.resolve(id)
      if (id && await bondRegistry.exists(id)) return bondRegistry.get(id)
      if (resolve) return bondRegistry.resolveAll()
      return bondRegistry.getAll()
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWallets({ id, resolve = false }) {
    try {
      const bondWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.BondWallet`)
      if (id && resolve && await bondWalletRegistry.exists(id)) return bondWalletRegistry.resolve(id)
      if (id && await bondWalletRegistry.exists(id)) return bondWalletRegistry.get(id)
      if (resolve) return bondWalletRegistry.resolveAll()
      return bondWalletRegistry.getAll()
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByOwner({ owner, resolve = false }) {
    try {
      const [bondWalletRegistry, bondWallets] = await Promise.all([
        this.connection.getAssetRegistry(`${this.NS}.BondWallet`),
        this.connection.query('bondWalletByHolder', { owner: `resource:org.tbma.Account#${owner}` }),
      ])
      return resolve ? Promise.all(bondWallets.map(bondWallet => bondWalletRegistry.resolve(bondWallet.id))) : bondWallets
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByBond({ bond, resolve = false }) {
    try {
      const [bondWalletRegistry, bondWallets] = await Promise.all([
        this.connection.getAssetRegistry(`${this.NS}.BondWallet`),
        this.connection.query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${bond}` }),
      ])
      return resolve ? Promise.all(bondWallets.map(bondWallet => bondWalletRegistry.resolve(bondWallet.id))) : bondWallets
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getMoneyWallets({ id, resolve = false }) {
    try {
      const moneyWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.MoneyWallet`)
      if (id && resolve && await moneyWalletRegistry.exists(id)) return moneyWalletRegistry.resolve(id)
      if (id && await moneyWalletRegistry.exists(id)) return moneyWalletRegistry.get(id)
      if (resolve) return moneyWalletRegistry.resolveAll()
      return moneyWalletRegistry.getAll()
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async createAccount({ id, name, isIssuer, isInvestor, isGateway }) {
    try {
      const account = this.factory.newResource(this.NS, 'Account', id)
      const role = this.factory.newConcept(this.NS, 'Role')
      role.isIssuer = isIssuer
      role.isInvestor = isInvestor
      role.isGateway = isGateway
      account.name = name
      account.role = role
      const accountRegistry = await this.connection.getParticipantRegistry(`${this.NS}.Account`)
      accountRegistry.add(account)
      return Promise.resolve({ account: this.serializer.toJSON(account) })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createBond({ symbol, parValue, couponRate, paymentFrequency, issuer, issueTerm, hardCap, issuerMoneyWallet }) {
    try {
      if (!argsIsExist(symbol, parValue, couponRate, paymentFrequency, issuer, issueTerm, hardCap, issuerMoneyWallet)) return Promise.reject(new Error('missing required params'))

      const [issuerObj, issuerMoneyWalletObj] = await Promise.all([this.getAccounts(issuer), this.getMoneyWallets(issuerMoneyWallet)])
      if (!argsIsExist(issuerObj, issuerMoneyWalletObj)) return Promise.reject(new Error('asset is not found'))

      const subscriptionContract = this.factory.newConcept(this.NS, 'SubscriptionContract')
      subscriptionContract.subscripers = []
      subscriptionContract.isCloseSale = false
      subscriptionContract.hardCap = hardCap
      subscriptionContract.soldAmount = 0
      subscriptionContract.issuerMoneyWallet = this.factory.newRelationship(this.NS, 'MoneyWallet', issuerMoneyWallet)
      const bond = this.factory.newResource(this.NS, 'Bond', uuidv4())
      bond.symbol = symbol
      bond.parValue = parValue
      bond.couponRate = couponRate
      bond.paymentFrequency = paymentFrequency
      bond.totalSupply = 0
      bond.issueTerm = issueTerm // month
      bond.issuer = this.factory.newRelationship(this.NS, 'Account', issuer)
      bond.couponPayouts = []
      bond.subscriptionContract = subscriptionContract

      const bondRegistry = await this.connection.getAssetRegistry(`${this.NS}.Bond`)
      await bondRegistry.add(bond)
      return Promise.resolve({ bond: this.serializer.toJSON(bond) })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createBondWallet({ bond, owner, couponWallet }) {
    try {
      if (!argsIsExist(bond, owner, couponWallet)) return Promise.reject(new Error('missing required params'))
      const [bondAsset, ownerParti, couponwalletAsset] = await Promise.all([
        this.getBonds(bond), this.getAccounts(owner), this.getMoneyWallets(couponWallet),
      ])
      if (!argsIsExist(bondAsset, ownerParti, couponwalletAsset)) return Promise.reject(new Error('asset is not found'))

      const bondWallet = this.factory.newResource(this.NS, 'BondWallet', uuidv4())
      bondWallet.bond = this.factory.newRelationship(this.NS, 'Bond', bond)
      bondWallet.owner = this.factory.newRelationship(this.NS, 'Account', owner)
      bondWallet.couponWallet = this.factory.newRelationship(this.NS, 'MoneyWallet', couponWallet)
      bondWallet.balance = 0

      const bondWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.BondWallet`)
      await bondWalletRegistry.add(bondWallet)
      return Promise.resolve({ bondWallet: this.serializer.toJSON(bondWallet) })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createMoneyWallet({ owner }) {
    try {
      if (!argsIsExist(owner)) return Promise.reject(new Error('missing required params'))
      const ownerParti = await this.getAccounts(owner)
      if (!argsIsExist(ownerParti)) return Promise.reject(new Error('asset is not found'))

      const moneyWallet = this.factory.newResource(this.NS, 'MoneyWallet', uuidv4())
      moneyWallet.owner = this.factory.newRelationship(this.NS, 'Account', owner)
      moneyWallet.balance = 0

      const moneyWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.MoneyWallet`)
      await moneyWalletRegistry.add(moneyWallet)
      return Promise.resolve({ moneyWallet: this.serializer.toJSON(moneyWallet) })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = BondNetwork
