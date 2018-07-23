import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { moneyWithdrawTransaction } from '../../actions/transaction';

export const NAME = 'MONEY_WITHDRAW'
export default connect((state) => ({ isOpen: state.view.modalOpenName === NAME, moneyWallet: state.asset.moneyWallets.find((a) => a.id === state.view.moneyWalletSelectedId) || state.asset.moneyWallets[0] }), { setModalOpenName, moneyWithdrawTransaction })(class extends Component {
  state = {
    from: '',
    amount: 0,
    isLoading: false
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = {
      from: this.props.moneyWallet.id,
      amount: this.state.amount
    }
    this.props.moneyWithdrawTransaction(data)
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
            <Grid item sm={12}><Typography variant="title">Money Withdraw</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="From" disabled value={this.props.moneyWallet.id} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Amount" onChange={(event) => this.setState({ amount: Number(event.target.value) })} /></Grid>
          </Grid>
          <Grid container justify="center" spacing={32} style={{ paddingTop: 20 }}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
