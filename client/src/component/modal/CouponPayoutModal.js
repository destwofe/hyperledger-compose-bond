import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import Axios from 'axios'

class BondTransferModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken'), moneywallets: null, walletbalance: '-', selectedMoneyWallet: null, bond: null }
  }

  postSubmitCouponPayout = () => {
    if (this.state.selectedMoneyWallet) {
      Axios.post('http://localhost:3335/api/transaction/couponpayout', { bond: this.state.bond.symbole, moneyWallet: this.state.selectedMoneyWallet}, { headers: {accessToken: this.state.accessToken} })
        .then(response => {
          this.props.toggle()
          NotificationManager.info('Coupon payout success')
        })
        .catch(console.log)
    }
  }

  fetchData = (bond) => {
    Axios.get('http://localhost:3335/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
      .then(response => {
        this.setState({ moneywallets: response.data, bond })
      })
      .catch(console.log)
  }

  renderMoneyWalletOptios = () => {
    if (this.state.moneywallets == null) {
      return (<option>Loading . . .</option>)
    } else if (this.state.moneywallets.length > 0) {
      const optionList = [<option key="none">select</option>]
      optionList.push(...this.state.moneywallets.map(moneyWallet => (<option key={moneyWallet.id}>{moneyWallet.id}</option>)))
      return optionList
    }
    return
  }

  onChangeCaptureHandler = (newState) => {
    this.setState(newState, () => {
      const moneyWallet = this.state.moneywallets.find(a => a.id === this.state.selectedMoneyWallet)
      if (moneyWallet) {
        this.setState({ walletbalance: moneyWallet.balance })
      } else {
        this.setState({ walletbalance: '-' })
      }
    })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Which wallet you want to use for coupon payout</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="bondpurchase-moneywallet">Pay: Money Wallet</label>
              <select className="form-control" id="bondpurchase-moneywallet" onChangeCapture={(event) => this.onChangeCaptureHandler({ selectedMoneyWallet: event.target.value })}>
                {this.renderMoneyWalletOptios()}
              </select>
              <label htmlFor="bondpurchase-moneywallet">Balance: {!isNaN(this.state.walletbalance) ? `${Number(this.state.walletbalance).toLocaleString()} ฿` : ''}</label>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postSubmitCouponPayout}>Submit</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default BondTransferModal
