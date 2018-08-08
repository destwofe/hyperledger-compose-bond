import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core'

import { fetchBondWallet } from "../../actions/asset";
import { getSafe } from '../../utils';

const mapStateToProps = (state) => {
  const bond = (state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0])
  const subscripers = bond.subscriptionContract.subscripers
  return { bond, subscripers }
}

export default connect(mapStateToProps, { fetchBondWallet })(class extends Component {
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
          <TableRow><TableCell>Owner</TableCell><TableCell>Amount</TableCell><TableCell>Depository Account</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {subscripers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(subscrpier =>
            <TableRow key={Math.random() * 100000}>
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
