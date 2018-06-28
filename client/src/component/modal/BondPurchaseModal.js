import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import Axios from 'axios'

class BondWalletModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken'), moneywallets: null, bondwallets: null, walletbalance: '-', selectedMoneyWallet: 'select', selectedBondWallet: 'select', amount: 0, payAmount: 0 }
  }

  componentDidMount() {
    this.fetchMoneyWallet()
    this.fetchBondWallet()
  }

  fetchMoneyWallet = () => {
    Axios.get('http://localhost:3335/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
    .then((response) => {
      this.setState({ moneywallets: response.data })
    })
    .catch(error => {
      NotificationManager.error(error.toString, 'Uncatch exception')
    })
  }

  fetchBondWallet = () => {
    Axios.get('http://localhost:3335/api/bondwallets', { headers: { accessToken: this.state.accessToken } })
    .then((response) => {
      this.setState({ bondwallets: response.data })
    })
    .catch(error => {
      NotificationManager.error(error.toString, 'Uncatch exception')
    })
  }

  postBondPurchase = () => {
    if (this.state.selectedBondWallet !== 'select' && this.state.selectedMoneyWallet !== 'select' && this.state.payAmount <= this.state.walletbalance) {
      const data = {
        bond: this.props.bond.symbole,
        moneywallet: this.state.selectedMoneyWallet,
        bondwallet: this.state.selectedBondWallet,
        amount: this.state.amount
      }
      Axios.post('http://localhost:3335/api/transaction/bondpurchase', data, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.props.toggle()
        })
        .catch(error => {
          NotificationManager.error(error.toString, 'Uncatch exception')
        })
    } else {
      NotificationManager.error('cannot purchase please check input value', 'Error Purchase!')
    }
  }

  onChangeCaptureHandler = (newState) => {
    this.setState(newState, () => {
      const moneyWallet = this.state.moneywallets.find(a => a.id === this.state.selectedMoneyWallet)
      if (moneyWallet) {
        this.setState({walletbalance: moneyWallet.balance})
      } else {
        this.setState({walletbalance: '-'})
      }
    })
  }

  onChangeHandler = (newState) => {
    this.setState(newState, () => {
      this.setState({ payAmount: this.state.amount * this.props.bond.parValue })
    })
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

  renderBondWalletOptios = () => {
    if (this.state.bondwallets == null) {
      return (<option>Loading . . .</option>)
    } else if (this.state.bondwallets.length > 0) {
      const bondwallets = this.state.bondwallets.filter(a => a.bond === `resource:org.tbma.Bond#${this.props.bond.symbole}`)
      const optionList = [<option key="none">select</option>]
      optionList.push(...bondwallets.map(bondWallet => (<option key={bondWallet.id}>{bondWallet.id}</option>)))
      return optionList
    }
    return
  }

  render() {
    if (this.props.bond) {
      return (
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader>Bond Wallet</ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label htmlFor="bondpurchase-symbole">Symbole</label>
                <input className="form-control" id="bondpurchase-symbole" type="text" defaultValue={this.props.bond.symbole} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="bondpurchase-parvalue">Parvalue</label>
                <input className="form-control" id="bondpurchase-parvalue" type="text" defaultValue={this.props.bond.parValue} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="bondpurchase-amount">Amount</label>
                <input className="form-control" id="bondpurchase-amount" type="number" defaultValue="0" onChange={(event) => this.onChangeHandler({ amount: event.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="bondpurchase-bondwallet">Receive: Bond Wallet</label>
                <select className="form-control" id="bondpurchase-bondwallet" onChangeCapture={(event) => this.onChangeCaptureHandler({selectedBondWallet: event.target.value})}>
                  {this.renderBondWalletOptios()}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bondpurchase-moneywallet">Pay: Money Wallet</label>
                <select className="form-control" id="bondpurchase-moneywallet" onChangeCapture={(event) => this.onChangeCaptureHandler({selectedMoneyWallet: event.target.value})}>
                  {this.renderMoneyWalletOptios()}
                </select>
                <label htmlFor="bondpurchase-moneywallet">Balance: {this.state.walletbalance}</label>
              </div>
              <div className="form-group">
                <label htmlFor="bondpurchase-amount">Pay: Amount</label>
                <input className="form-control" id="bondpurchase-amount" type="number" value={this.state.payAmount} disabled/>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-primary mx-2" onClick={this.postBondPurchase}>Submit</button>
            <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
          </ModalFooter>
        </Modal>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default BondWalletModal
