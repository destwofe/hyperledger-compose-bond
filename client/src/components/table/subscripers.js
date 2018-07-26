import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Table, TableBody, TableRow, TableCell, TableHead, TableFooter, TablePagination } from '@material-ui/core'

import { fetchBondWallet } from "../../actions/asset";
import { getSafe } from '../../utils';

export default connect((state) => ({ subscripers: getSafe(() => (state.asset.subscriptionContract.find(a => a.id === state.view.subscriptionContractSelectedId) ||  state.asset.subscriptionContract[0]).subscripers) }), { fetchBondWallet })(class extends Component {
  state = {
    page: 0
  }

  render() {
    const { subscripers } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return getSafe(() => subscripers.length) > 0 ? (
      <Table>
        <TableHead>
          <TableRow><TableCell>Owner</TableCell><TableCell>Amount</TableCell><TableCell>Bond Wallet</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {subscripers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(subscrpier =>
            <TableRow key={Math.random() * 100}>
              <TableCell>{getSafe(() => subscrpier.wallet.owner.name) || 'Permission denined'}</TableCell>
              <TableCell>{Number(subscrpier.amount).toLocaleString()} Unit</TableCell>
              <TableCell>{getSafe(() => subscrpier.wallet.id || 'Permission denined')}</TableCell>
            </TableRow>)}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TablePagination
              count={subscripers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, page) => { this.setState({ page }) }}
              rowsPerPageOptions={[rowsPerPage]}>
            </TablePagination>
          </TableRow>
        </TableFooter> */}
      </Table>) : null
  }
})
