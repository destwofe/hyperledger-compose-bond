import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Bonds from './Bond'
import MoneyWallet from './wallet/MoneyWallet'
import BondWallet from './wallet/BondWallet'
import BondDetails from './BondDetails'

const isLogin = () => localStorage.getItem('accessToken') != null

const Main = () => isLogin() ? (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/bonds' component={Bonds} />
      <Route exact path='/bonds/:id' component={BondDetails} />
      <Route exact path='/wallets/moneywallets' component={MoneyWallet} />
      <Route exact path='/wallets/bondwallets' component={BondWallet} />
    </Switch>
  </main>
) : (
  <main>
    <h1>Please Login</h1>
  </main>
)

export default Main
