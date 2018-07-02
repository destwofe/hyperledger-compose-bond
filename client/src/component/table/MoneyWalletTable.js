import React, { Component } from 'react'
import Axios from 'axios'

import MoneyTransferModal from '../modal/MoneyTransferModal'

class MoneyWallet extends Component {
  constructor() {
    super()
    this.state = { moneyWallets: null, accessToken: localStorage.getItem('accessToken'), transferFrom: '', isModalOpen: false }
  }

  componentDidMount() {
    this.fetchMoneyWallet()
  }

  fetchMoneyWallet = () => {
    Axios.get('http://api.destwofe.zyx/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
    .then((response) => {
      this.setState({ moneyWallets: response.data })
    })
    .catch(console.log)
  }

  modalToggle = (isReloadData) => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
    if (isReloadData) this.fetchMoneyWallet()
  }

  renderMoneyWalletTableList = () => {
    if (this.state.moneyWallets.length > 0) {
      return this.state.moneyWallets.map((moneyWallet) => (
        <tr key={moneyWallet.id}>
          <th>{moneyWallet.id}</th>
          <td className="text-right">{Number(moneyWallet.balance).toLocaleString()} THB</td>
          <td><button className="btn btn-outline-dark" onClick={() => this.setState({ isModalOpen: true, transferFrom: moneyWallet.id })}>transfer</button></td>
        </tr>
      ))
    } else {
      return (
        <tr>
          <td colSpan="4">
            <h1 className="text-center my-5">You don't have bond wallet please create</h1>
          </td>
        </tr>
      )
    }
  }

  render() {
    if (this.state.moneyWallets == null) {
      return (
        <div>
          <h1 className="text-center my-5">Loading . . .</h1>
        </div>
      )
    }
    return (
      <div>
        <table className="table">
          <thead>
            <tr><th scope="col">Id</th><th scope="col">Balance</th><th>Action</th></tr>
          </thead>
          <tbody>
            {this.renderMoneyWalletTableList()}
          </tbody>
        </table>
        <MoneyTransferModal from={this.state.transferFrom} isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default MoneyWallet
