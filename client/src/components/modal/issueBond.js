import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, Modal, Typography, Grid, TextField, Button, CircularProgress, MenuItem } from '@material-ui/core'
import { setModalOpenName } from '../../actions/view';
import { fetchMoneyWallet } from '../../actions/asset';
import { issueBond } from '../../actions/transaction'
import { getSafe } from '../../utils';

export const NAME = 'ISSUE_BOND'
export default connect((state) => ({ isOpen: state.view.modalOpenName === NAME, moneyWallets: state.asset.moneyWallets }), { setModalOpenName, fetchMoneyWallet, issueBond })(class extends Component {
  state = {
    symbol: '',
    parValue: 1000,
    couponRate: 5.0,
    paymentFrequency: 1,
    issueTerm: 12,
    hardCap: 1000000,
    issuerMoneyWallet: getSafe(() => this.props.moneyWallets[0].id)
  }

  componentDidMount() {
    this.props.fetchMoneyWallet()
  }

  submitHandler = () => {
    this.setState({ isLoading: true })
    const data = { ...this.state }
    this.props.issueBond(data)
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
            <Grid item sm={12}><Typography variant="title">Issue Bond</Typography></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth label="Symbol" onChange={(event) => this.setState({ symbol: event.target.value })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth type="number" defaultValue={this.state.parValue} label="Par value" onChange={(event) => this.setState({ parValue: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth type="number" defaultValue={this.state.couponRate} label="Coupon rate" helperText="(percent/year)" onChange={(event) => this.setState({ couponRate: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth type="number" defaultValue={this.state.paymentFrequency} label="Payment frequency" helperText="(time/year)" onChange={(event) => this.setState({ paymentFrequency: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth type="number" defaultValue={this.state.issueTerm} label="Issue Term" helperText="(month)" onChange={(event) => this.setState({ issueTerm: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15 }}><TextField fullWidth type="number" defaultValue={this.state.hardCap} label="Hardcap" helperText={`(unit) [${Number(this.state.hardCap*this.state.parValue).toLocaleString()} THB]`} onChange={(event) => this.setState({ hardCap: Number(event.target.value) })} /></Grid>
            <Grid item sm={9} style={{ paddingTop: 15, paddingBottom: 20 }}><TextField fullWidth select label="issuerMoneyWallet" value={this.state.issuerMoneyWallet} helperText={`balance ${getSafe(() => Number(this.props.moneyWallets.find(a => a.id === this.state.issuerMoneyWallet).balance).toLocaleString()) || 0} THB`} onChange={(event) => this.setState({ issuerMoneyWallet: event.target.value })}>{this.props.moneyWallets.map(moneyWallet => <MenuItem key={moneyWallet.id} value={moneyWallet.id}>{`${moneyWallet.id}`}</MenuItem>)}</TextField></Grid>
          </Grid>
          <Grid container justify="center" spacing={32}>
            <Grid item><Button variant="contained" color="primary" onClick={() => this.submitHandler()}>Submit{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} color='inherit' /></div> : null}</Button></Grid>
            <Grid item><Button variant="contained" color="secondary" onClick={() => this.props.setModalOpenName(null)}>Close</Button></Grid>
          </Grid>
        </Paper>
      </Modal>
  }
})
