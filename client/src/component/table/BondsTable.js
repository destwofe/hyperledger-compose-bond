import React, { Component } from 'react'
import Axios from 'axios'

import BondPurchaseModal from '../modal/BondPurchaseModal'

class BondTable extends Component {
  constructor() {
    super()
    this.state = { bonds: [], accessToken: localStorage.getItem('accessToken'), purchaseBond: null, isModalOpen: false }
  }

  componentDidMount() {
    this.fetchBonds()
  }

  fetchBonds = () => {
    Axios.get('http://localhost:3335/api/bonds', { headers: { accessToken: this.state.accessToken } })
      .then((response) => {
        this.setState({ bonds: response.data })
      })
      .catch(console.log)
  }

  modalToggle = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  renderBondTableList = () => {
    return this.state.bonds.map((bond) => (
      // <tr onClick={() => { this.props.history.push(`/bond/${bond.symbole}`) }} key={bond.symbole} style={{ cursor: "pointer" }}>
      <tr key={bond.symbole}>
        <th>{bond.symbole}</th>
        <td>{bond.couponRate}</td>
        <td>{bond.maturity}</td>
        <td>{bond.issuer.replace(/resource:org.tbma.Account#/g, '')}</td>
        <td>
          <button className="btn btn-outline-info mx-1" onClick={() => this.props.history.push(`/bonds/${bond.symbole}`)}>Info</button>
          <button className="btn btn-outline-dark mx-1" onClick={() => this.setState({ isModalOpen: true, purchaseBond: bond })}>Purchase</button>
        </td>
      </tr>
    ))
  }

  render() {
    if (this.state.bonds.length === 0) {
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
            <tr><th scope="col">Symbole</th><th scope="col">Coupon Rate</th><th scope="col">Maturity</th><th scope="col">Issuer</th><th>Action</th></tr>
          </thead>
          <tbody>
            {this.renderBondTableList()}
          </tbody>
        </table>
        <BondPurchaseModal bond={this.state.purchaseBond} isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default BondTable
