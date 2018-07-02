import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Axios from 'axios'

import CouponPayoutModal from './CouponPayoutModal'

class BondHoldersModal extends Component {
  constructor(props) {
    super(props)
    this.state = { accessToken: localStorage.getItem('accessToken'), bondWallets: [], bond: null, couponPerPeriod: 0, isCouponModalOpen: false }

    this.child = React.createRef()
  }

  fetchData = (bond) => {
    this.setState({ bond })
    Axios.get(`http://api.destwofe.zyx/api/bondwallets?filter=bond&&bond=${bond.symbole}`, { headers: { accessToken: this.state.accessToken } })
      .then(response => {
        this.setState({ bondWallets: response.data }, this.calculateCouponTotal)
      })
    this.child.current.fetchData(bond)
  }

  getPeriodDivider = (period) => {
    switch (period) {
      case 'YEAR': return 1
      case 'WEEK': return 365 / 7
      case 'DAY': return 365
      default: return 1
    }
  }

  calculateCouponTotal = () => {
    const bond = this.state.bond
    const couponPerYears = this.state.bondWallets.map((wallet) => wallet.balance * (bond.couponRate / 100) * bond.parValue)
    const couponPerYear = couponPerYears.reduce((a, b) => a + b, 0)
    const couponPerPeriod = couponPerYear / this.getPeriodDivider(bond.paymentFrequency.period) / bond.paymentFrequency.periodMultipier
    this.setState({ couponPerPeriod })
  }

  renderTable = () => (
    <table className="table mx-auto">
      <thead><tr>
        <th>ID</th>
        <th>Holder-Name</th>
        <th>Balance</th>
      </tr></thead>
      <tbody>
        {this.state.bondWallets.map(bondWallet => (
          <tr key={bondWallet.id}>
            <td>{bondWallet.id}</td>
            <td>{bondWallet.owner.replace(/resource:org.tbma.Account#/g, '')}</td>
            <td className="text-right">{Number(bondWallet.balance).toLocaleString()} unit</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  toggle = () => {
    this.props.toggle()
    this.setState({ bondWallets: [] })
  }

  couponToggle = () => {
    this.setState({isCouponModalOpen: !this.state.isCouponModalOpen})
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.toggle} size="lg">
          <ModalHeader>Bond Holders - {(this.state.bond && this.state.bond.symbole) || ''}</ModalHeader>
          <ModalBody>
            {this.state.bondWallets.length > 0 ? this.renderTable() : <h1 className="my-5">Loading . . .</h1>}
          </ModalBody>
          <ModalFooter>
            <div className="w-100 text-left">Coupon per period - {Number(this.state.couponPerPeriod).toLocaleString()} ฿</div>
            <button type="button" className="btn btn-primary mx-2" onClick={this.couponToggle}>Coupon Payout</button>
            <button type="button" className="btn btn-danger mx-2" onClick={this.toggle}>Close</button>
          </ModalFooter>
        </Modal>
        <CouponPayoutModal ref={this.child} isOpen={this.state.isCouponModalOpen} toggle={this.couponToggle} />
      </div>
    )
  }
}

export default BondHoldersModal
