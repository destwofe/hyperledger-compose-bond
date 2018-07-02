import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Axios from 'axios'

class BondWalletModal extends Component {
  constructor(props) {
    super()
    this.state = { moneyWallets: null, bonds: null, accessToken: localStorage.getItem('accessToken'), bondWallet: { bond: 'select', couponwallet: 'select' } }
  }

  componentDidMount() {
    this.fetchMoneyWallet()
    this.fetchBonds()
  }

  fetchMoneyWallet = () => {
    Axios.get('http://api.destwofe.xyz/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
    .then((response) => {
      this.setState({ moneyWallets: response.data })
    })
    .catch(console.log)
  }

  fetchBonds = () => {
    Axios.get('http://api.destwofe.xyz/api/bonds', { headers: { accessToken: this.state.accessToken } })
      .then((response) => {
        this.setState({ bonds: response.data })
      })
      .catch(console.log)
  }

  postCreateBondWallet = () => {
    Axios.post('http://api.destwofe.xyz/api/bondwallets', { ...this.state.bondWallet }, { headers: { accessToken: this.state.accessToken } })
      .then((response) => {
        this.props.toggle(true)
      })
      .catch(console.log)
  }

  onChangeCaptureHandler = (newState) => {
    this.setState({ bondWallet: { ...this.state.bondWallet, ...newState } })
  }

  renderMoneyWalletOptios = () => {
    if (this.state.moneyWallets == null) {
      return (<option>Loading . . .</option>)
    } else if (this.state.moneyWallets.length > 0) {
      const optionList = [<option key="none">select</option>]
      optionList.push(...this.state.moneyWallets.map(moneyWallet => (<option key={moneyWallet.id}>{moneyWallet.id}</option>)))
      return optionList
    }
    return
  }

  renderBondOptios = () => {
    if (this.state.bonds == null) {
      return (<option>Loading . . .</option>)
    } else if (this.state.bonds.length > 0) {
      const optionList = [<option key="none">select</option>]
      optionList.push(...this.state.bonds.map(bond => (<option key={bond.symbole}>{bond.symbole}</option>)))
      return optionList
    }
    return
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="bondWalletModalBondSelect">Bond</label>
              <select className="form-control" id="bondWalletModalBondSelect" onChangeCapture={(event) => this.onChangeCaptureHandler({bond: event.target.value})}>
                {this.renderBondOptios()}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bondWalletModalMoneyWalletSelect">Coupon Wallet</label>
              <select className="form-control" id="bondWalletModalMoneyWalletSelect" onChangeCapture={(event) => this.onChangeCaptureHandler({couponwallet: event.target.value})}>
                {this.renderMoneyWalletOptios()}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bondWalletBalance">Balance</label>
              <input className="form-control" id="bondWalletBalance" type="number" value="0" disabled/>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postCreateBondWallet}>Create</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default BondWalletModal
