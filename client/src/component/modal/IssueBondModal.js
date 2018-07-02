import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import Axios from 'axios'

class IssueBondModal extends Component {
  constructor(props) {
    super()
    this.state = { accessToken: localStorage.getItem('accessToken'), moneyWallets: null, symbole: '', parValue: 1000, couponRate: 3.5, paymentPeroid: 'YEAR', paymentMultipier: 1, maturity: '2019-01-10', issuerMoneyWallet: 'select' }
  }

  componentDidMount() {
    this.fetchMoneyWallet()
  }

  postIssueBond = () => {
    const bondObject = {
      symbole: this.state.symbole,
      parValue: this.state.parValue,
      couponRate: this.state.couponRate,
      paymentPeroid: this.state.paymentPeroid,
      paymentMultipier: this.state.paymentMultipier,
      maturity: new Date(this.state.maturity),
      issuerMoneyWallet: this.state.issuerMoneyWallet
    }
    console.log(bondObject)
    if (bondObject.issuerMoneyWallet !== 'select' && bondObject.symbole !== '') {
      Axios.post('http://api.destwofe.zyx/api/bonds', bondObject, { headers: { accessToken: this.state.accessToken } })
        .then((response) => {
          this.props.toggle(true)
        })
        .catch(error => NotificationManager.error(error.toString, 'Uncatch exception'))
    } else {
      NotificationManager.error('cannot transfer please check input value', 'Error Transfer!')
    }
    // if (this.props.bond && this.props.from !== this.state.to && this.state.amount > 0) {
    //   const transferTransaction = { from: this.props.from, to: this.state.to, amount: this.state.amount, bond: this.props.bond }
    //   Axios.post('http://api.destwofe.zyx/api/transaction/bondtransfer', transferTransaction, { headers: { accessToken: this.state.accessToken } })
    //     .then((response) => {
    //       this.props.toggle(true)
    //     })
    //     .catch(error => NotificationManager.error(error.toString, 'Uncatch exception'))
    // } else {
    //   NotificationManager.error('cannot transfer please check input value', 'Error Transfer!')
    // }
  }

  fetchMoneyWallet = () => {
    Axios.get('http://api.destwofe.zyx/api/moneywallets', { headers: { accessToken: this.state.accessToken } })
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
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Bond Wallet</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="issuebond-symbole">Symbole</label>
              <input className="form-control" id="issuebond-symbole" type="text" value={this.state.symbole} onChange={(event) => this.setState({ symbole: String(event.target.value).toUpperCase() })} />
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
              <label htmlFor="issuebond-period">Period</label>
              <select className="form-control" id="issuebond-period" onChangeCapture={(event) => this.setState({ paymentPeroid: event.target.value })}>
                <option>YEAR</option>
                <option>MONTH</option>
                <option>WEEK</option>
                <option>DAY</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="issuebond-periodmulti">Period Multipier</label>
              <input className="form-control" id="issuebond-periodmulti" type="number" value={this.state.paymentMultipier} onChange={(event) => this.setState({ paymentMultipier: event.target.value })} />
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
