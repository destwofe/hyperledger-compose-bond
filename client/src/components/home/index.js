import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Header from '../header'
import Bond from '../container/bond'
import BondWallet from '../container/bondWallet'
import MoneyWallet from '../container/moneyWallet'
import ModalRoot from '../modal'

export default class extends Component {
  render() {
    return (<div>
      <Header />
      <Route exact path='/bonds' component={Bond} />
      <Route exact path='/bondwallets' component={BondWallet} />
      <Route exact path='/moneywallets' component={MoneyWallet} />
      <ModalRoot />
    </div>)
  }
}