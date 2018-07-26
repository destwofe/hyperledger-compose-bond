import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, Card, CardContent, Typography, Grid, Button, TableFooter, CircularProgress } from '@material-ui/core'

import { fetchMoneyWallet, createMoneyWallet } from '../../actions/asset'
import { setMoneyWalletSelectedId } from '../../actions/view'

// export default (props) => <Paper>Money Wallet list</Paper>

export default connect((state) => ({ moneyWallets: state.asset.moneyWallets }), { setMoneyWalletSelectedId, fetchMoneyWallet, createMoneyWallet })(class extends Component {
  state = {
    page: 0,
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchMoneyWallet()
  }

  createMoneyWalletHandler = () => {
    this.setState({ isLoading: true })
    this.props.createMoneyWallet().then(() => { this.setState({ isLoading: false }) })
  }

  render() {
    const rowsPerPage = 10
    const page = this.state.page
    const { moneyWallets } = this.props
    return <Table>
      {moneyWallets.length <= 0 ? null : <TableBody>
        {moneyWallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(moneyWallet =>
          <TableRow key={moneyWallet.id} style={{ height: 0 }} onClick={() => this.props.setMoneyWalletSelectedId(moneyWallet.id)}>
            <TableCell style={{ padding: 0 }}>
              <Card style={{ margin: 0 }}>
                <CardContent>
                  <Grid container justify="flex-start">
                    <Grid item sm={12}><Typography variant="body1" color="textSecondary">{moneyWallet.id}</Typography></Grid>
                    <Grid item sm><Typography variant="subheading" color="textSecondary">Balance :</Typography></Grid>
                    <Grid item sm><Typography variant="subheading">{Number(moneyWallet.balance).toLocaleString()} THB</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </TableCell>
          </TableRow>)}
      </TableBody>}
      <TableFooter>
        <TableRow style={{ height: 0 }}>
          <TableCell style={{ padding: 0 }}>
            <Button variant="contained" color="default" style={{ width: '100%' }} onClick={() => this.createMoneyWalletHandler()}>Create Account{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} /></div> : null}</Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  }
})