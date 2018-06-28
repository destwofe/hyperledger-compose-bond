import React, { Component } from 'react'
import BondWalletTable from '../table/BondWalletTable'
import BondWalletModal from '../modal/BondWalletModal'

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
    if (isReloadData) this.child.current.fetchBondWallet()
  }

  render() {
    return (
      <div>
        <button className="btn btn-primary my-2 mx-2" onClick={() => { this.modalToggle() }}>Issue Bond</button>
        <BondWalletTable ref={this.child} />
        <BondWalletModal isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default Homepage
