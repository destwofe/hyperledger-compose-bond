import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress, MenuItem } from '@material-ui/core'

import { getSafe } from '../../utils';
import { setModalOpenName } from '../../actions/view';
import { fetchMoneyWallet, fetchBondWallet } from '../../actions/asset';
import { submitSubscriptionTransaction } from '../../actions/transaction';

const mapStateToProps = (state) => {
  const isOpen = state.view.modalOpenName === NAME
  const bond = state.asset.bonds.find(a => a.id === state.view.bondSelectedId) || state.asset.bonds[0]
  const moneyWallets = state.asset.moneyWallets
  const bondWallets = state.asset.bondWallets.filter(a => a.bond.id === bond.id)
  return { isOpen, bond, moneyWallets, bondWallets }
}
export const NAME = 'SUBSCRIPTION'
export default connect(mapStateToProps, { setModalOpenName, submitSubscriptionTransaction, fetchMoneyWallet, fetchBondWallet })(class extends Component {
  state = {
    amount: 0,
    isLoading: false,
    moneyWallet: getSafe(() => this.props.moneyWallets[0].id),
    bondWallet: getSafe(() => this.props.bondWallets[0].id)
  }

  componentDidMount() {
    // this.props.fetchMoneyWallet()
    //   .then(response => {
    //     if (!this.state.moneyWallet) this.setState({ moneyWallet: getSafe(() => this.props.moneyWallets[0].id) })
    //   })
    // this.props.fetchBondWallet(this.props.contract.bond.id)
    //   .then(response => {
    //     if (!this.state.bondWallet) this.setState({ bondWallet: getSafe(() => this.props.bondWallets[0].id) })
    //   })
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const { bond } = this.props
    this.props.submitSubscriptionTransaction({ bond: bond.id, moneyWallet: this.state.moneyWallet, bondWallet: this.state.bondWallet, amount: this.state.amount })
      .then(response => {
        this.setState({ isLoading: false })
        this.props.setModalOpenName(false)
      })
  }

  render() {
    const { isOpen, bond, moneyWallets, bondWallets } = this.props
    return !isOpen ? null :
      <Modal open={isOpen} onClose={() => this.props.setModalOpenName(null)}>
        <Paper style={{ position: 'absolute', top: '45%', left: '50%', transform: `translate(-${45}%, -${50}%)`, padding: 20 }}>
          <Grid container justify="center">
            <Grid item sm={12}><Typography variant="title">Bond subscription transaction</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Symbol" disabled value={bond.symbol} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Par Value" disabled value={bond.parValue} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}><TextField fullWidth label="Amount" onChange={(event) => this.setState({ amount: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}>
              <TextField fullWidth select label="Bond Receive: Depository Account"
                value={this.state.bondWallet}
                helperText={`balance ${getSafe(() => Number(bondWallets.find(a => a.id === this.state.bondWallet).balance).toLocaleString()) || 0} Unit`}
                onChange={(event) => this.setState({ bondWallet: event.target.value })} >
                {bondWallets.map(bondWallet => <MenuItem key={bondWallet.id} value={bondWallet.id}>{`${bondWallet.id}`}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}><TextField fullWidth label="Pay Amount" disabled value={`${Number(bond.parValue * this.state.amount).toLocaleString()} THB`} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}>
              <TextField fullWidth select label="Pay With: Bank Account"
                value={this.state.moneyWallet}
                helperText={`balance ${getSafe(() => Number(moneyWallets.find(a => a.id === this.state.moneyWallet).balance).toLocaleString()) || 0} THB`}
                onChange={(event) => this.setState({ moneyWallet: event.target.value })} >
                {moneyWallets.map(moneyWallet => <MenuItem key={moneyWallet.id} value={moneyWallet.id}>{`${moneyWallet.id}`}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={32}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
