import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { bondTransferTransaction } from '../../actions/transaction';

export const NAME = 'BOND_TREANSFER'
export default connect((state) => ({ isOpen: state.view.modalOpenName === NAME, bondWallet: state.asset.bondWallets.find((a) => a.id === state.view.bondWalletSelectedId) || state.asset.bondWallets[0] }), { setModalOpenName, bondTransferTransaction })(class extends Component {
  state = {
    to: '',
    amount: 0,
    isLoading: false
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = {
      from: this.props.bondWallet.id,
      to: this.state.to,
      amount: this.state.amount
    }
    this.props.bondTransferTransaction(data)
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
            <Grid item sm={12}><Typography variant="title">Bond Transfer</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Bond" disabled value={`${this.props.bondWallet.bond.symbol} (${this.props.bondWallet.bond.id})`} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="From" disabled value={this.props.bondWallet.id} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="To" onChange={(event) => this.setState({ to: event.target.value })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}><TextField fullWidth label="Amount" onChange={(event) => this.setState({ amount: Number(event.target.value) })} /></Grid>
          </Grid>
          <Grid container justify="center" spacing={32}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
