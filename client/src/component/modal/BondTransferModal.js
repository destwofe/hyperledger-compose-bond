import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import Axios from 'axios'

class BondTransferModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken'), to: '', amount: 0 }
  }

  postCreateBondWallet = () => {
    if (this.props.bond && this.props.from !== this.state.to && this.state.amount > 0) {
      const transferTransaction = {from: this.props.from, to: this.state.to, amount: this.state.amount, bond: this.props.bond}
      Axios.post('http://api.destwofe.com/api/transaction/bondtransfer', transferTransaction, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.props.toggle(true)
        })
        .catch(error => NotificationManager.error(error.toString, 'Uncatch exception'))
    } else {
      NotificationManager.error('cannot transfer please check input value', 'Error Transfer!')
    }
    
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
            <label htmlFor="bondtransfer-symbole">Bond</label>
              <input className="form-control" id="bondtransfer-symbole" type="text" value={this.props.bond} disabled/>
            </div>
            <div className="form-group">
            <label htmlFor="bonstransfer-from">From</label>
              <input className="form-control" id="bonstransfer-from" type="text" value={this.props.from} disabled/>
            </div>
            <div className="form-group">
            <label htmlFor="bondtransfer-to">To</label>
              <input className="form-control" id="bondtransfer-to" type="text" value={this.state.to} onChange={(event) => { this.setState({ to: event.target.value }) }} />
            </div>
            <div className="form-group">
              <label htmlFor="bondtransfer-amount">Amount</label>
              <input className="form-control" id="bondtransfer-amount" type="number" value={this.state.amount} onChange={(event) => { this.setState({ amount: event.target.value }) }}/>
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

export default BondTransferModal
