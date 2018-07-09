import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import Axios from 'axios'

class IssueBondModal extends Component {
  constructor(props) {
    super()
    const currentDate = new Date()
    const currentDateString = currentDate.toISOString().substring(0, 10)
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    const nextYearString = nextYear.toISOString().substring(0, 10)
    this.state = { accessToken: localStorage.getItem('accessToken'), moneyWallets: null, symbol: '', parValue: 1000, couponRate: 3.5, paymentFrequency: 1, issueDate: currentDateString, maturity: nextYearString, issuerMoneyWallet: 'select' }
  }

  componentDidMount() {
    this.fetchMoneyWallet()
  }

  postIssueBond = () => {
    const bondObject = {
      symbol: this.state.symbol,
      parValue: this.state.parValue,
      couponRate: this.state.couponRate,
      paymentFrequency: this.state.paymentFrequency,
      issueDate: new Date(this.state.issueDate),
      maturity: new Date(this.state.maturity),
      issuerMoneyWallet: this.state.issuerMoneyWallet
    }
    if (bondObject.issuerMoneyWallet !== 'select' && bondObject.symbol !== '') {
      Axios.post('http://localhost:3335/api/bonds', bondObject, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.props.toggle(true)
        })
        .catch(error => NotificationManager.error(error.toString, 'Uncatch exception'))
    } else {
      NotificationManager.error('cannot transfer please check input value', 'Error Transfer!')
    }
  }

  fetchMoneyWallet = () => {
    Axios.get('http://localhost:3335/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
      .then((response) => {
        this.setState({ moneyWallets: response.data })
      })
      .catch(console.log)
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

  render() {
    // symbol, parValue, couponRate, paymentFrequency, issueDate, maturity, issuerMoneyWallet
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="issuebond-symbol">Symbol</label>
              <input className="form-control" id="issuebond-symbol" type="text" value={this.state.symbol} onChange={(event) => this.setState({ symbol: String(event.target.value).toUpperCase() })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-parvalue">Par value</label>
              <input className="form-control" id="issuebond-parvalue" type="number" value={this.state.parValue} onChange={(event) => this.setState({ parValue: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-couponrate">Coupon Rate</label>
              <input className="form-control" id="issuebond-couponrate" type="number" step="0.1" value={this.state.couponRate} onChange={(event) => this.setState({ couponRate: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-periodmulti">Period Frequency</label>
              <input className="form-control" id="issuebond-periodmulti" type="number" value={this.state.paymentFrequency} onChange={(event) => this.setState({ paymentFrequency: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-issueDate">issueDate</label>
              <input className="form-control" id="issuebond-issueDate" type="date" value={this.state.issueDate} onChange={(event) => this.setState({ issueDate: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-maturity">Maturity</label>
              <input className="form-control" id="issuebond-maturity" type="date" value={this.state.maturity} onChange={(event) => this.setState({ maturity: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-moneywallet">Receive: Money Wallet</label>
              <select className="form-control" id="issuebond-moneywallet" onChangeCapture={(event) => this.setState({ issuerMoneyWallet: event.target.value })}>
                {this.renderMoneyWalletOptios()}
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary mx-2" onClick={this.postIssueBond}>Submit</button>
          <button type="button" className="btn btn-danger mx-2" onClick={this.props.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default IssueBondModal
