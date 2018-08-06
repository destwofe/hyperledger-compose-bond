import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchBondTransferEvents } from '../../actions/events'
import { getSafe } from '../../utils'
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter, TablePagination, Typography, Tooltip, Grid } from '@material-ui/core';

const mapStateToProps = (state) => {
  const bondWallet = state.asset.bondWallets.find((a) => a.id === state.view.bondWalletSelectedId) || state.asset.bondWallets[0]
  const bondTrahsferEvents = state.event.bondTransfers.filter((a) => getSafe(() => a.from.id) === bondWallet.id || getSafe(() => a.to.id) === bondWallet.id)

  return {bondWallet, bondTrahsferEvents}
}

export default connect(mapStateToProps, { fetchBondTransferEvents })(class extends Component {
  state = {
    page: 0
  }

  render() {
    const { bondTrahsferEvents } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return !bondTrahsferEvents || bondTrahsferEvents.length <= 0 ? null :
      <Table>
        <TableHead>
        <TableRow><TableCell colSpan="4"><Typography variant="subheading">Transfer Transactions</Typography></TableCell></TableRow>
          <TableRow><TableCell>From -> To</TableCell><TableCell>Amount</TableCell><TableCell>Timestamp</TableCell><TableCell>Remark</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {bondTrahsferEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(((event) =>
            <Tooltip key={event.eventId} title={`Event ID: ${event.eventId}`}>
            <TableRow>
              <TableCell><Grid container>{event.from ? <Grid item sm={12}>{getSafe(() => `FROM#${event.from.id}`)}</Grid> : null}{event.to ? <Grid item sm={12}>{getSafe(() => `TO#${event.to.id}`)}</Grid> : null}</Grid></TableCell>
              <TableCell>{Number(event.amount).toLocaleString()} Unit</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
              <TableCell>{event.remark}</TableCell>
            </TableRow>
            </Tooltip>))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={bondTrahsferEvents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, page) => { this.setState({ page }) }}
              rowsPerPageOptions={[rowsPerPage]}>
            </TablePagination>
          </TableRow>
        </TableFooter>
      </Table>
  }
})
