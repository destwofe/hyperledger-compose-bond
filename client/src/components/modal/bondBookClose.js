import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { submitCouponSnapTransaction } from '../../actions/transaction';

export const NAME = 'BOND_BOOK_CLOSE'
export default connect((state) => {
  const isOpen = state.view.modalOpenName === NAME
  const bond = state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0]
  return {isOpen, bond}
}, { setModalOpenName, submitCouponSnapTransaction })(class extends Component {
  state = {
    isLoading: false,
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = {
      bond: this.props.bond.id,
      moneyWallet: this.state.moneyWallet
    }
    this.props.submitCouponSnapTransaction(data)
      .then(response => {
        this.setState({ isLoading: false })
        this.props.setModalOpenName(null)
      })
  }

  render() {
    const {bond, isOpen} = this.props
    return !isOpen ? null :
      <Modal open={isOpen} onClose={() => this.props.setModalOpenName(null)}>
        <Paper style={{ position: 'absolute', top: '45%', left: '50%', transform: `translate(-${45}%, -${50}%)`, padding: 20 }}>
          <Grid container justify="center">
            <Grid item sm={12}><Typography variant="title">Bond Book Close</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, width: 300 }}><TextField fullWidth label="Bond" disabled value={`${bond.symbol} (${bond.id})`} /></Grid>
          </Grid>
          <Grid container justify="center" spacing={32} style={{paddingTop: 20}}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
