import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, TableHead, TableFooter, TablePagination, Button } from '@material-ui/core'

import { fetchTransaction } from '../../actions/transaction';
import { setModalOpenName, setTransactionSelectedId, setCouponPayoutSelectedIndex } from '../../actions/view';
import { getSafe } from '../../utils';

import { TRANSACTION_MODAL, COUPON_PAYOUY_MODAL, BOND_BOOK_CLOSE_DETAILS_MODAL } from '../modal/'

export default connect((state) => ({ bond: state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0], transactions: state.transactions }), { fetchTransaction, setModalOpenName, setTransactionSelectedId, setCouponPayoutSelectedIndex })(class extends Component {
  state = {
    page: 0
  }

  componentDidMount() {
    console.log(this.props.bond)
    if (getSafe(() => this.props.bond.couponPayouts.length) > 0) {
      this.props.fetchTransaction(this.props.bond.couponPayouts.map(a => a.transactionId))
    }
  }

  render() {
    const { bond: { couponPayouts } } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return couponPayouts.length > 0 ? (
      <Table>
        <TableHead>
          <TableRow><TableCell>Closing Date</TableCell><TableCell>Coupon per unit</TableCell><TableCell style={{ textAlign: 'center' }}>ACTIONS</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {couponPayouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => <TableRow key={transaction.closingDate}>
            <TableCell>{new Date(transaction.closingDate).toLocaleString()}</TableCell>
            <TableCell>{transaction.couponPerUnit}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
            {transaction.transactionId?
              <Button variant='contained' style={{ width: '100%' }} onClick={() => { this.props.setModalOpenName(TRANSACTION_MODAL); this.props.setTransactionSelectedId(transaction.transactionId); this.props.setCouponPayoutSelectedIndex(index) }}>TRANSACTION DETAILS</Button>:
              <Button variant='contained' style={{ width: '100%' }} onClick={() => { this.props.setModalOpenName(BOND_BOOK_CLOSE_DETAILS_MODAL); this.props.setCouponPayoutSelectedIndex(index) }}>HOLDERS DETAILS</Button>}
              {transaction.transactionId?null:
              <Button variant='contained' style={{ width: '100%' }} onClick={() => { this.props.setModalOpenName(COUPON_PAYOUY_MODAL); this.props.setCouponPayoutSelectedIndex(index) }}>Pay</Button>}
            </TableCell>
          </TableRow>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={couponPayouts.length}
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
