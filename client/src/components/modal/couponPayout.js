import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress, MenuItem } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { submitCouponPayoutTransaction } from '../../actions/transaction';
import { getSafe } from '../../utils';

export const NAME = 'COUPON_PAYOUT'
export default connect((state) => {
  const isOpen = state.view.modalOpenName === NAME
  const bond = state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0]
  const couponPayoutSelectedIndex = state.view.couponPayoutSelectedIndex
  const moneyWallets = state.asset.moneyWallets
  return { isOpen, bond, moneyWallets, couponPayoutSelectedIndex }
}, { setModalOpenName, submitCouponPayoutTransaction })(class extends Component {
  state = {
    isLoading: false,
    moneyWallet: this.props.moneyWallets[0].id
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = {
      bond: this.props.bond.id,
      moneyWallet: this.state.moneyWallet,
      couponPayoutIndex: this.props.couponPayoutSelectedIndex,
    }
    this.props.submitCouponPayoutTransaction(data)
      .then(response => {
        this.setState({ isLoading: false })
        this.props.setModalOpenName(null)
      })
  }

  render() {
    const { moneyWallets, bond, isOpen, couponPayoutSelectedIndex } = this.props
    const couponPatout = bond.couponPayouts[couponPayoutSelectedIndex]
    return !isOpen ? null :
      <Modal open={isOpen} onClose={() => this.props.setModalOpenName(null)}>
        <Paper style={{ position: 'absolute', top: '45%', left: '50%', transform: `translate(-${45}%, -${50}%)`, padding: 20 }}>
          <Grid container justify="center">
            <Grid item sm={12}><Typography variant="title">Coupon Payout</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Bond" disabled value={`${bond.symbol} (${bond.id})`} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Book Closing Time" disabled value={`${getSafe(() => new Date(couponPatout.closingDate))}`} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}>
              <TextField fullWidth select label="Pay With: Bank Account"
                value={this.state.moneyWallet}
                helperText={`balance ${getSafe(() => Number(moneyWallets.find(a => a.id === this.state.moneyWallet).balance).toLocaleString()) || 0} THB`}
                onChange={(event) => this.setState({ moneyWallet: event.target.value })} >
                {moneyWallets.map(moneyWallet => <MenuItem key={moneyWallet.id} value={moneyWallet.id}>{`${moneyWallet.id}`}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={32} style={{ paddingTop: 20 }}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
