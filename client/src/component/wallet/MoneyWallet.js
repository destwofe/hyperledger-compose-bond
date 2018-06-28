import React, { Component } from 'react'
import MoneyWalletTable from '../table/MoneyWalletTable'
import MoneyWalletModal from '../modal/MoneyWalletModal'

class Homepage extends Component {
  constructor(props) {
    super()
    this.state = {
      isModalOpen: false
    }

    this.child = React.createRef()
  }

  modalToggle = (isReloadData) => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
    if (isReloadData) this.child.current.fetchMoneyWallet()
  }

  render() {
    return (
      <div>
        <button className="btn btn-primary my-2 mx-2" onClick={() => { this.modalToggle() }}>Create Money Wallet</button>
        <MoneyWalletTable ref={this.child} />
        <MoneyWalletModal isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default Homepage
