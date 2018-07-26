import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, Card, CardContent, Typography, Grid, Button, TableFooter, CircularProgress, TablePagination, TableHead, TextField } from '@material-ui/core'

import { fetchBondWallet } from '../../actions/asset'
import { setBondWalletSelectedId, setModalOpenName } from '../../actions/view'
import { CREATE_BOND_WALLET_NAME } from '../modal'

export default connect((state) => ({ bondWallets: state.asset.bondWallets, role: state.account.accountData.role }), { setBondWalletSelectedId, fetchBondWallet, setModalOpenName })(class extends Component {
  state = {
    page: 0,
    isLoading: false,
    filteredBondWallets: this.props.bondWallets
  }

  componentDidMount() {
    this.props.fetchBondWallet()
  }

  handlerFilterChange = (event) => {
    const value = event.target.value
    this.setState({filteredBondWallets: this.props.bondWallets.filter(a => a.bond.symbol.toLowerCase().indexOf(value) !== -1)})
  }

  render() {
    const rowsPerPage = 10
    const page = this.state.page
    const { role, bondWallets } = this.props
    const filteredBondWallets = this.state.filteredBondWallets
    return <Table>
      {bondWallets.length <= 0 ? null : <TableHead>
          <TableRow>
            <TableCell>
              <TextField fullWidth label="Search" onChange={this.handlerFilterChange} />
            </TableCell>
          </TableRow>
        </TableHead>}
      {bondWallets.length <= 0 ? null : <TableBody>
        {filteredBondWallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(bondWallet =>
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
        {bondWallets.length <= 0 ? null : <TableRow>
          <TablePagination
            count={filteredBondWallets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={(event, page) => { this.setState({ page }) }}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </TableRow>}
        <TableRow style={{ height: 0 }}>
          {!role.isInvestor ? null : <TableCell style={{ padding: 0 }}><Button variant="contained" color="default" style={{ width: '100%' }} onClick={() => this.props.setModalOpenName(CREATE_BOND_WALLET_NAME)}>Create Account{this.state.isLoading ? <div style={{ paddingLeft: 5 }}><CircularProgress size={16} /></div> : null}</Button></TableCell>}
        </TableRow>
      </TableFooter>
    </Table>
  }
})
