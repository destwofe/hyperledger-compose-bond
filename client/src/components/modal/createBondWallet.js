import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress, MenuItem } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { getSafe } from '../../utils';
import { createBondWallet } from '../../actions/asset'

export const NAME = 'CREATE_BOND_WALLET'
export default connect((state) => ({ isOpen: state.view.modalOpenName === NAME, moneyWallets: state.asset.moneyWallets, bonds: state.asset.bonds }), { setModalOpenName, createBondWallet })(class extends Component {
  state = {
    bond: getSafe(() => this.props.bonds[0].id),
    couponWallet: getSafe(() => this.props.moneyWallets[0].id)
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = { ...this.state }
    this.props.createBondWallet(data)
      .then(response => {
        this.setState({ isLoading: false })
        this.props.setModalOpenName(false)
      })
  }

  render() {
    return !this.props.isOpen ? null :
      <Modal open={this.props.isOpen} onClose={() => this.props.setModalOpenName(null)}>
        <Paper style={{ position: 'absolute', top: '45%', left: '50%', transform: `translate(-${45}%, -${50}%)`, padding: 20 }}>
          <Grid container justify="center">
            <Grid item sm={12}><Typography variant="title">Create Bond Wallet</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth select label="Bond" value={this.state.bond} helperText={`id: ${this.state.bond}`} onChange={(event) => this.setState({ bond: event.target.value })}>{this.props.bonds.map(bond => <MenuItem key={bond.id} value={bond.id}>{`${bond.symbol}`}</MenuItem>)}</TextField></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth select label="Coupon receive wallet" value={this.state.couponWallet} helperText={`balance ${getSafe(() => Number(this.props.moneyWallets.find(a => a.id === this.state.couponWallet).balance).toLocaleString()) || 0} THB`} onChange={(event) => this.setState({ couponWallet: event.target.value })}>{this.props.moneyWallets.map(moneyWallet => <MenuItem key={moneyWallet.id} value={moneyWallet.id}>{`${moneyWallet.id}`}</MenuItem>)}</TextField></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField disabled fullWidth label="Amount" value={`0 (unit)`} /></Grid>
          </Grid>
          <Grid container justify="center" spacing={32} style={{ paddingTop: 20 }}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
