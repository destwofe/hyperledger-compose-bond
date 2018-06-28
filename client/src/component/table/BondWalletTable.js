import React, { Component } from 'react'
import Axios from 'axios'

import BondTransferModal from '../modal/BondTransferModal'

class BondWallet extends Component {
  constructor() {
    super()
    this.state = { bondwallets: null, accessToken: localStorage.getItem('accessToken'), isModalOpen: false }
  }

  componentDidMount() {
    this.fetchBondWallet()
  }

  fetchBondWallet = () => {
    if (this.props.bond) {
      Axios.get(`http://localhost:3335/api/bondwallets?filter=bond&&bond=${this.props.bond}`, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.setState({ bondwallets: response.data })
        })
        .catch(console.log)
    } else {
      Axios.get('http://localhost:3335/api/bondwallets?filter=owner', { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.setState({ bondwallets: response.data })
        })
        .catch(console.log)
    }
  }

  modalToggle = (isReloadData) => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
    if (isReloadData) this.fetchBondWallet()
  }

  renderMoneyWalletTableList = () => {
    if (this.state.bondwallets.length > 0) {
      return this.state.bondwallets.map((item) => (
        <tr key={item.id}>
          <th>{item.id}</th>
          <th><a href={`/bonds/${item.bond.replace(/resource:org.tbma.Bond#/g, '')}`}>{item.bond.replace(/resource:org.tbma.Bond#/g, '')}</a></th>
          <td className="text-right">{Number(item.balance).toLocaleString()} unit</td>
          <td><button className="btn btn-outline-dark" onClick={() => this.setState({ isModalOpen: true, transferFrom: item.id, transferBond: item.bond.replace(/resource:org.tbma.Bond#/g, '') })}>transfer</button></td>
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
    if (this.state.bondwallets == null) {
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
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Symbole</th>
              <th scope="col">Balance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderMoneyWalletTableList()}
          </tbody>
        </table>
        <BondTransferModal from={this.state.transferFrom} bond={this.state.transferBond} isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default BondWallet
