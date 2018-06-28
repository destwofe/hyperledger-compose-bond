import React, { Component } from 'react'
import BondTable from './table/BondsTable'
import IssueBondModal from './modal/IssueBondModal'

class Bond extends Component {
  constructor(props) {
    super()
    this.state = {
      isModalOpen: true
    }

    this.child = React.createRef()
  }

  modalToggle = (isReloadData) => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
    if (isReloadData) this.child.current.fetchBonds()
  }

  render() {
    return (
      <div>
        <button className="btn btn-primary my-2 mx-2" onClick={() => { this.modalToggle() }}>Create Bond Wallet</button>
        <BondTable ref={this.child} />
        <IssueBondModal isOpen={this.state.isModalOpen} toggle={this.modalToggle} />
      </div>
    )
  }
}

export default Bond
