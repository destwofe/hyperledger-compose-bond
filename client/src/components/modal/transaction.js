import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Typography, Paper, Grid, TableHead, Table, TableCell, TableBody, TableRow } from '@material-ui/core';
import { setModalOpenName } from '../../actions/view';

export const NAME = 'TRANSACTION'
export default connect((state) => ({ isOpen: state.view.modalOpenName === NAME, transaction: state.transactions.find(a => a.transactionId === state.view.transactionSelectedId), view: state.view }), { setModalOpenName })(class extends Component {
  render() {
    const transaction = this.props.transaction
    return (this.props.isOpen && transaction ? <Modal open={this.props.isOpen} onClose={() => this.props.setModalOpenName(null)}>
      <Paper style={{ position: 'absolute', top: '45%', left: '50%', transform: `translate(-${45}%, -${50}%)`, padding: 20 }}>
        <Typography variant="title">Transaction</Typography>
        <Typography variant="caption" style={{ padding: 10 }}>{transaction.transactionId}</Typography>
        <Grid container justify='center' spacing={16}>
          <Grid item><Typography variant="subheading">Payment Account</Typography></Grid><Grid item><Typography variant="body2">{transaction.eventsEmitted[0].from.replace('resource:org.tbma.MoneyWallet#', '')}</Typography></Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Money Account</TableCell><TableCell>Money Amount</TableCell><TableCell>Bond Wallet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.eventsEmitted.map(event => <TableRow key={event.eventId}><TableCell>{event.to.replace('resource:org.tbma.MoneyWallet#', '')}</TableCell><TableCell>{Number(event.amount).toLocaleString()} THB</TableCell><TableCell>{event.remark.replace('COUPON:org.tbma.BondWallet#', '')}</TableCell></TableRow>)}
          </TableBody>
        </Table>
        <Grid container justify='center' spacing={16} style={{paddingTop: 10}}>
          <Grid item>Payment Date</Grid><Grid item>{new Date(transaction.transactionTimestamp).toLocaleString()}</Grid>
        </Grid>
      </Paper>
    </Modal> : null
    )
  }
})
