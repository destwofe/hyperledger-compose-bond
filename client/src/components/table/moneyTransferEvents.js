import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getSafe } from '../../utils'
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter, TablePagination, Typography, Tooltip, Grid } from '@material-ui/core';

const mapStateToProps = (state) => {
  const moneyWallet = state.asset.moneyWallets.find((a) => a.id === state.view.moneyWalletSelectedId) || state.asset.moneyWallets[0]
  const moneyTrahsferEvents = state.event.moneyTransfers.filter(a => getSafe(() => a.from.id) === moneyWallet.id || getSafe(() => a.to.id) === moneyWallet.id)
  return {moneyWallet, moneyTrahsferEvents}
}

export default connect(mapStateToProps, { })(class extends Component {
  state = {
    page: 0
  }

  render() {
    const { moneyTrahsferEvents } = this.props
    const rowsPerPage = 10
    const { page } = this.state

    return !moneyTrahsferEvents || moneyTrahsferEvents.length <= 0 ? null :
      <Table>
        <TableHead>
        <TableRow><TableCell colSpan="4"><Typography variant="subheading">Transfer Transactions</Typography></TableCell></TableRow>
          <TableRow><TableCell>From -> To</TableCell><TableCell>Amount</TableCell><TableCell>Timestamp</TableCell><TableCell>Remark</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {moneyTrahsferEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(((event) =>
            <Tooltip key={event.eventId} title={`Event ID: ${event.eventId}`}>
            <TableRow>
              <TableCell><Grid container>{event.from ? <Grid item sm={12}>{getSafe(() => event.from.replace('resource:org.tbma.MoneyWallet#', 'From#'))}</Grid> : null}{event.to ? <Grid item sm={12}>{getSafe(() => event.to.replace('resource:org.tbma.MoneyWallet#', 'To#'))}</Grid> : null}</Grid></TableCell>
              <TableCell>{Number(event.amount).toLocaleString()} THB</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
              <TableCell>{event.remark.replace('org.tbma.', '').replace(/(?<=#).*/g, '').replace('#', '')}</TableCell>
            </TableRow>
            </Tooltip>))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={moneyTrahsferEvents.length}
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
