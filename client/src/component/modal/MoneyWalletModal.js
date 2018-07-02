import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Axios from 'axios'

class MoneyWalletModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken') }
  }

  postCreateMoneyWallet = () => {
    Axios.post('http://api.destwofe.com/api/moneywallets', { }, { headers: { accessToken: this.state.accessToken } })
      .then((response) => {
        this.props.toggle(true)
      })
      .catch(console.log)
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="bondWalletBalance">Balance</label>
              <input className="form-control" id="bondWalletBalance" type="number" value="0" disabled/>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postCreateMoneyWallet}>Create</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default MoneyWalletModal
