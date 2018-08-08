import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, TableHead, TableFooter, TablePagination } from '@material-ui/core'

import { fetchBondWallet } from "../../actions/asset";
import { getSafe } from '../../utils';

const mapStateToProps = (state) => {
  const bond = state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0]
  const wallets = state.asset.bondWallets.filter(a => getSafe(() => a.bond.id) === bond.id && a.balance > 0)

  return { bond, wallets }
}

export default connect(mapStateToProps, { fetchBondWallet })(class extends Component {
  state = {
    page: 0
  }

  componentDidMount() {
    // this.props.fetchBondWallet(this.props.bond.id)
  }

  render() {
    const { wallets } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return getSafe(() => wallets.length) > 0 ? (
      <Table>
        <TableHead>
          <TableRow><TableCell>ID</TableCell><TableCell>Owner</TableCell><TableCell>Balance</TableCell><TableCell>Bank Account</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {wallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(wallet => <TableRow key={wallet.id}><TableCell>{wallet.id}</TableCell><TableCell>{wallet.owner.name}</TableCell><TableCell>{Number(wallet.balance).toLocaleString()} unit</TableCell><TableCell>{getSafe(() => wallet.couponWallet.replace('resource:org.tbma.MoneyWallet#', '')) || getSafe(() => wallet.couponWallet.id)}</TableCell></TableRow>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={wallets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, page) => { this.setState({ page }) }}
              rowsPerPageOptions={[rowsPerPage]}>
            </TablePagination>
          </TableRow>
        </TableFooter>
      </Table>) : null
  }
})
