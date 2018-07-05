import React, { Component } from 'react'
import Axios from 'axios'

import BondPurchaseModal from '../modal/BondPurchaseModal'
import BondHoldersModal from '../modal/BondHoldersModal'

class BondTable extends Component {
  constructor(props) {
    super(props)
    this.state = { bonds: [], accessToken: localStorage.getItem('accessToken'), purchaseBond: null, isModalOpen: false, isHolderModalOpen: false }

    this.child = React.createRef()
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

  holderModalToggle = () => {
    this.setState({ isHolderModalOpen: !this.state.isHolderModalOpen })
  }

  renderBondTableList = (bondList) => {
    return (
      <table className="table">
        <thead>
          <tr><th scope="col">Symbole</th><th scope="col">Coupon Rate</th><th scope="col">Maturity</th><th scope="col">Issuer</th><th>Action</th></tr>
        </thead>
        <tbody>
          {bondList.map((bond) => (
            <tr key={bond.symbole}>
              <th>{bond.symbole}</th>
              <td>{bond.couponRate} %</td>
              <td>{new Date(bond.maturity).toLocaleDateString()}</td>
              <td>{bond.issuer}</td>
              <td>
                <button className="btn btn-outline-info mx-1" onClick={() => this.props.history.push(`/bonds/${bond.symbole}`)}>Info</button>
                {
                  bond.isIssuer ?
                    <button className="btn btn-outline-dark mx-1" onClick={() => {
                      this.child.current.fetchData(bond)
                      this.setState({ isHolderModalOpen: true, purchaseBond: bond })
                    }}>Holders</button> :
                    <button className="btn btn-outline-dark mx-1" onClick={() => this.setState({ isModalOpen: true, purchaseBond: bond })}>Purchase</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>)
  }

  renderBondTable = () => {
    const data = this.state.bonds.map(bond => ({
      ...bond,
      issuer: bond.issuer.replace(/resource:org.tbma.Account#/g, ''),
      isIssuer: bond.issuer.replace(/resource:org.tbma.Account#/g, '') === localStorage.getItem('email')
    }))

    const isIssuerBonds = data.filter(a => a.isIssuer)
    const isNotIssuerBonds = data.filter(a => !a.isIssuer)

    const isIssuerBondsTable = isIssuerBonds.length > 0 ? this.renderBondTableList(isIssuerBonds) : <div></div>
    const isNotIssuerBondsTable = isNotIssuerBonds.length > 0 ? this.renderBondTableList(isNotIssuerBonds) : <div></div>

    return <div><h2>My Issue Bonds</h2>{isIssuerBondsTable}<h2>Bonds</h2>{isNotIssuerBondsTable}</div>
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
      {this.renderBondTable()}
      <BondPurchaseModal bond={this.state.purchaseBond} isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      <BondHoldersModal ref={this.child} isOpen={this.state.isHolderModalOpen} toggle={this.holderModalToggle} />
    </div>)
  }
}

export default BondTable
