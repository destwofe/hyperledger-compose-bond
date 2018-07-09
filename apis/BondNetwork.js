const { BusinessNetworkConnection } = require('composer-client')
const uuidv4 = require('uuid/v4')

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
    this.identityRegistry = await this.connection.getIdentityRegistry()
    this.historian = await this.connection.getHistorian()
    // this.identity = await this.getCardParticipantIdentity()
  }

  async getCardParticipantIdentity() {
    const identities = await this.identityRegistry.getAll() // TODO
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
      const resource = this.serializer.fromJSON(json)
      await this.connection.submitTransaction(resource)
      return Promise.resolve({ success: true })
    } catch (error) {
      console.log(error)
      return Promise.reject(new Error(error.details))
    }
  }

  async RoleUpdateTransaction({ account, role, isGrant }) {
    return this.submitTransaction({
      $class: 'org.tbma.RoleUpdateTransaction',
      account: `resource:org.tbma.MoneyWallet#${account}`,
      role,
      isGrant,
    })
  }

  async MoneyTransferTransaction(from, to, amount) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyTransferTransaction',
      from: `resource:org.tbma.MoneyWallet#${from}`,
      to: `resource:org.tbma.MoneyWallet#${to}`,
      amount,
    })
  }

  async BondTransferTransaction({ bond, from, to, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondTransferTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      from: `resource:org.tbma.BondWallet#${from}`,
      to: `resource:org.tbma.BondWallet#${to}`,
      amount,
    })
  }

  async BondPurchaseTransaction({ bond, moneyWallet, bondWallet, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondPurchaseTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      bondWallet: `resource:org.tbma.BondWallet#${bondWallet}`,
      moneyWallet: `resource:org.tbma.MoneyWallet#${moneyWallet}`,
      amount,
    })
  }

  async CouponPayoutTransaction({ moneyWallet, bond }) {
    return this.submitTransaction({
      $class: 'org.tbma.CouponPayoutTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      moneyWallet: `resource:org.tbma.MoneyWallet#${moneyWallet}`,
    })
  }

  async MoneyDepositTransaction({ to, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyDepositTransaction',
      to: `resource:org.tbma.MoneyWallet#${to}`,
      amount,
    })
  }

  async MoneyWithdrawTransaction({ from, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.MoneyWithdrawTransaction',
      from: `resource:org.tbma.MoneyWallet#${from}`,
      amount,
    })
  }

  async getHistorians() {
    try {
      const historians = await this.historian.getAll()
      return historians
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getEvents() {
    try {
      const historians = await this.getHistorians()
      return [].concat(...historians.map(a => a.eventsEmitted))
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getAccounts(id) {
    try {
      const accountRegistry = await this.connection.getParticipantRegistry(`${this.NS}.Account`)
      if (!id) return accountRegistry.getAll()
      if (await accountRegistry.exists(id)) return accountRegistry.get(id)
      return undefined
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBonds(id) {
    try {
      const bondRegistry = await this.connection.getAssetRegistry(`${this.NS}.Bond`)
      if (!id) return bondRegistry.getAll()
      if (await bondRegistry.exists(id)) return bondRegistry.resolve(id)
      return undefined
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWallets(id) {
    try {
      const bondWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.BondWallet`)
      if (!id) return bondWalletRegistry.resolveAll()
      if (await bondWalletRegistry.exists(id)) return bondWalletRegistry.resolve(id)
      return undefined
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByOwner(owner) {
    try {
      const [bondWalletRegistry, bondWallets] = await Promise.all([
        this.connection.getAssetRegistry(`${this.NS}.BondWallet`),
        this.connection.query('bondWalletByHolder', { owner: `resource:org.tbma.Account#${owner}` }),
      ])
      return Promise.all(bondWallets.map(bondWallet => bondWalletRegistry.resolve(bondWallet.id)))
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByBond(bond) {
    try {
      const [bondWalletRegistry, bondWallets] = await Promise.all([
        this.connection.getAssetRegistry(`${this.NS}.BondWallet`),
        this.connection.query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${bond}` }),
      ])
      return Promise.all(bondWallets.map(bondWallet => bondWalletRegistry.resolve(bondWallet.id)))
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getMoneyWallets(id) {
    try {
      const moneyWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.MoneyWallet`)
      if (!id) return moneyWalletRegistry.getAll()
      if (await moneyWalletRegistry.exists(id)) return moneyWalletRegistry.get(id)
      return undefined
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

  async createBond({ symbol, parValue, couponRate, paymentFrequency, issueDate, maturity, issuer, issuerMoneyWallet }) {
    try {
      if (!argsIsExist(symbol, parValue, couponRate, paymentFrequency, issueDate, maturity, issuer, issuerMoneyWallet)) return Promise.reject(new Error('missing required params'))
      const [ownerParti, couponwalletAsset] = await Promise.all([
        this.getAccounts(issuer), this.getMoneyWallets(issuerMoneyWallet),
      ])
      // if (argsIsExist(bondAsset)) return Promise.reject(new Error('bond asset is already exist'))
      if (!argsIsExist(ownerParti, couponwalletAsset)) return Promise.reject(new Error('asset is not found'))

      const bond = this.factory.newResource(this.NS, 'Bond', uuidv4())
      bond.symbol = symbol
      bond.parValue = parValue
      bond.couponRate = couponRate
      bond.paymentFrequency = paymentFrequency
      bond.issueDate = issueDate
      bond.maturity = maturity
      bond.totalSupply = 0
      bond.issuer = this.factory.newRelationship(this.NS, 'Account', issuer)
      bond.issuerMoneyWallet = this.factory.newRelationship(this.NS, 'MoneyWallet', issuerMoneyWallet)
      bond.couponPayout = []

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
