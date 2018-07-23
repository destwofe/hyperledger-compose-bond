import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Table, TableBody, TableRow, TableCell, TableHead, TableFooter, TablePagination, Button } from '@material-ui/core'

import { fetchTransaction } from '../../actions/transaction';
import { setModalOpenName, setTransactionSelectedId } from '../../actions/view';
import { getSafe } from '../../utils';

import { NAME as transactionModalName } from '../modal/transaction'

export default connect((state) => ({ bond: state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0], transactions: state.transactions }), { fetchTransaction, setModalOpenName, setTransactionSelectedId })(class extends Component {
  state = {
    page: 0
  }

  componentDidMount() {
    if (getSafe(() => this.props.bond.couponPayout.length) > 0) {
      this.props.fetchTransaction(this.props.bond.couponPayout.map(a => a.transactionId))
    }
  }

  render() {
    const { transactions, bond: { couponPayout } } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return couponPayout.length > 0 ? (
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="4"><Typography variant="subheading">Payout Transactions</Typography></TableCell></TableRow>
          <TableRow><TableCell>Transaction ID</TableCell><TableCell>Coupon per unit</TableCell><TableCell>Payment Date</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {couponPayout.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(transaction => <TableRow key={transaction.transactionId}><TableCell><Button color="primary" onClick={() => { this.props.setModalOpenName(transactionModalName); this.props.setTransactionSelectedId(transaction.transactionId) }}>{transaction.transactionId}</Button></TableCell><TableCell>{transaction.couponPerUnit}</TableCell><TableCell>{new Date(getSafe(() => transactions.find((a) => a.transactionId === transaction.transactionId).transactionTimestamp)).toLocaleString()}</TableCell></TableRow>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={couponPayout.length}
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
