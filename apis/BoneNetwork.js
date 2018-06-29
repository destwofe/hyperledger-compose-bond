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
      return Promise.reject(new Error(error.details))
    }
  }

  async setupDemo() {
    return this.submitTransaction({ $class: `${this.NS}.SetupDemo` })
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

  async BondPurchaseTransaction({ bond, moneywallet, bondwallet, amount }) {
    return this.submitTransaction({
      $class: 'org.tbma.BondPurchaseTransaction',
      bond: `resource:org.tbma.Bond#${bond}`,
      investorBondWallet: `resource:org.tbma.BondWallet#${moneywallet}`,
      investorMoneyWallet: `resource:org.tbma.MoneyWallet#${bondwallet}`,
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
      if (await bondRegistry.exists(id)) return bondRegistry.get(id)
      return undefined
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWallets(id) {
    try {
      const bondWalletRegistry = await this.connection.getAssetRegistry(`${this.NS}.BondWallet`)
      if (!id) return bondWalletRegistry.getAll()
      if (await bondWalletRegistry.exists(id)) return bondWalletRegistry.get(id)
      return undefined
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByOwner(owner) {
    try {
      return this.connection.query('bondWalletByHolder', { owner: `resource:org.tbma.Account#${owner}` })
    } catch (error) {
      return Promise.reject(new Error(error.details))
    }
  }

  async getBondWalletByBond(bond) {
    try {
      return this.connection.query('bondWalletByBond', { bond: `resource:org.tbma.Bond#${bond}` })
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

  async createBond({ symbole, parValue, couponRate, paymentMultipier, paymentPeroid, maturity, issuer, issuerMoneyWallet }) {
    try {
      if (!argsIsExist(symbole, couponRate, paymentMultipier, paymentPeroid, maturity, issuer, issuerMoneyWallet)) return Promise.reject(new Error('missing required params'))
      const [bondAsset, ownerParti, couponwalletAsset] = await Promise.all([
        this.getBonds(symbole), this.getAccounts(issuer), this.getMoneyWallets(issuerMoneyWallet),
      ])
      if (argsIsExist(bondAsset)) return Promise.reject(new Error('bond asset is already exist'))
      if (!argsIsExist(ownerParti, couponwalletAsset)) return Promise.reject(new Error('asset is not found'))

      const paymentFrequency = this.factory.newConcept(this.NS, 'PaymentFrequency')
      paymentFrequency.periodMultipier = paymentMultipier
      paymentFrequency.period = paymentPeroid
      const bond = this.factory.newResource(this.NS, 'Bond', symbole)
      bond.parValue = parValue
      bond.couponRate = couponRate
      bond.maturity = maturity
      bond.totalSupply = 0
      bond.issuer = this.factory.newRelationship(this.NS, 'Account', issuer)
      bond.issuerMoneyWallet = this.factory.newRelationship(this.NS, 'MoneyWallet', issuerMoneyWallet)
      bond.paymentFrequency = paymentFrequency

      const bondRegistry = await this.connection.getAssetRegistry(`${this.NS}.Bond`)
      await bondRegistry.add(bond)
      return Promise.resolve({ bond: this.serializer.toJSON(bond) })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createBondWallet({ bond, owner, couponwallet }) {
    try {
      if (!argsIsExist(bond, owner, couponwallet)) return Promise.reject(new Error('missing required params'))
      const [bondAsset, ownerParti, couponwalletAsset] = await Promise.all([
        this.getBonds(bond), this.getAccounts(owner), this.getMoneyWallets(couponwallet),
      ])
      if (!argsIsExist(bondAsset, ownerParti, couponwalletAsset)) return Promise.reject(new Error('asset is not found'))

      const bondWallet = this.factory.newResource(this.NS, 'BondWallet', uuidv4())
      bondWallet.bond = this.factory.newRelationship(this.NS, 'Bond', bond)
      bondWallet.owner = this.factory.newRelationship(this.NS, 'Account', owner)
      bondWallet.couponWallet = this.factory.newRelationship(this.NS, 'MoneyWallet', couponwallet)
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
