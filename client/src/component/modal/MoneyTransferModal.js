import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Axios from 'axios'

class MoneyTransferModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken'), to: '', amount: 0 }
  }

  postCreateBondWallet = () => {
    const transferTransaction = {from: this.props.from, to: this.state.to, amount: this.state.amount}
    Axios.post('http://localhost:3335/api/transaction/moneytransfer', transferTransaction, { headers: { accessToken: this.state.accessToken } })
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
            <label htmlFor="moneyTransferFrom">From</label>
              <input className="form-control" id="moneyTransferFrom" type="text" value={this.props.from} disabled/>
            </div>
            <div className="form-group">
            <label htmlFor="MoneyTransferTp">To</label>
              <input className="form-control" id="MoneyTransferTp" type="text" value={this.state.to} onChange={(event) => { this.setState({ to: event.target.value }) }} />
            </div>
            <div className="form-group">
              <label htmlFor="MoneyTransferAmount">Amount</label>
              <input className="form-control" id="MoneyTransferAmount" type="number" value={this.state.amount} onChange={(event) => { this.setState({ amount: event.target.value }) }}/>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postCreateBondWallet}>Submit</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default MoneyTransferModal
