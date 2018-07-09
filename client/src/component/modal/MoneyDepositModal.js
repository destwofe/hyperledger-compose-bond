import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Axios from 'axios'

const initialState = { accessToken: localStorage.getItem('accessToken'), type: 'Deposit', amount: 0 }

class MoneyTransferModal extends Component {
  constructor(props) {
    super()
    this.state = initialState
  }

  postDepositTransaction = () => {
    // const transferTransaction = { from: this.props.from, to: this.state.to, amount: this.state.amount }
    // Axios.post('http://localhost:3335/api/transaction/moneytransfer', transferTransaction, { headers: { accessToken: this.state.accessToken } })
    //   .then((response) => {
    //     this.props.toggle(true)
    //   })
    //   .catch(console.log)
    if (this.state.type === 'Deposit') {
      const deposiTransaction = { to: this.props.to, amount: this.state.amount }
      Axios.post('http://localhost:3335/api/transaction/moneydeposit', deposiTransaction, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.setState(initialState)
          this.props.toggle(true)
        })
        .catch(console.log)
    } else if (this.state.type === 'Withdraw') {
      const withdrawTransaction = { from: this.props.to, amount: this.state.amount }
      Axios.post('http://localhost:3335/api/transaction/moneywithdraw', withdrawTransaction, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.setState(initialState)
          this.props.toggle(true)
        })
        .catch(console.log)
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="MoneyDepositFor">To</label>
              <input className="form-control" id="MoneyDepositFor" type="text" value={this.props.to} onChange={(event) => { this.setState({ to: event.target.value }) }} disabled />
            </div>
            <div className="form-group">
              <label htmlFor="MoneyDepositeOrWithDraw">Type</label>
              <select className="form-control" id="MoneyDepositeOrWithDraw" onChangeCapture={event => this.setState({ type: event.target.value })} >
                <option>Deposit</option>
                <option>Withdraw</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="MoneyTransferAmount">Amount</label>
              <input className="form-control" id="MoneyTransferAmount" type="number" value={this.state.amount} onChange={(event) => { this.setState({ amount: event.target.value }) }} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postDepositTransaction}>Submit</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default MoneyTransferModal
