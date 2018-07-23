import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, Card, CardContent, Typography, Grid, Button, TableFooter, CircularProgress } from '@material-ui/core'

import { fetchBondWallet } from '../../actions/asset'
import { setBondWalletSelectedId, setModalOpenName } from '../../actions/view'
import { CREATE_BOND_WALLET_NAME } from '../modal'

export default connect((state) => ({ bondWallets: state.asset.bondWallets, state }), { setBondWalletSelectedId, fetchBondWallet, setModalOpenName })(class extends Component {
  state = {
    page: 0,
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchBondWallet()
  }

  // createBondWalletHandler = () => {
  //   this.setState({ isLoading: true })
  //   this.props.createBondWallet().then(() => { this.setState({ isLoading: false }) })
  // }

  render() {
    const rowsPerPage = 10
    const page = this.state.page
    const { bondWallets } = this.props
    return <Table>
      {bondWallets.length <= 0 ? null : <TableBody>
        {bondWallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(bondWallet =>
          <TableRow key={bondWallet.id} style={{ height: 0 }} onClick={() => this.props.setBondWalletSelectedId(bondWallet.id)}>
            <TableCell style={{ padding: 0 }}>
              <Card style={{ margin: 0 }}>
                <CardContent>
                  <Grid container justify="flex-start">
                    <Grid item sm={12}><Typography variant="body1" color="textSecondary">{bondWallet.id}</Typography></Grid>
                    <Grid item sm={4}><Typography variant="subheading" color="textSecondary">Bond :</Typography></Grid>
                    <Grid item sm={6}><Typography variant="subheading">{bondWallet.bond.symbol}</Typography></Grid>
                    <Grid item sm={4}><Typography variant="subheading" color="textSecondary">Balance :</Typography></Grid>
                    <Grid item sm={6}><Typography variant="subheading">{Number(bondWallet.balance).toLocaleString()} Unit</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            </TableCell>
          </TableRow>)}
      </TableBody>}
      <TableFooter>
        <TableRow style={{ height: 0 }}>
          <TableCell style={{ padding: 0 }}>
            <Button variant="contained" color="default" style={{ width: '100%' }} onClick={() => this.props.setModalOpenName(CREATE_BOND_WALLET_NAME)}>Create Account{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} /></div> : null}</Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  }
})
