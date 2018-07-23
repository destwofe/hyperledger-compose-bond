import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardContent, Table, TableBody, TableRow, TableCell, CardActions, Grid, Button } from '@material-ui/core'

import MoneyTransferEventsTable from '../table/moneyTransferEvents'
import { setModalOpenName } from '../../actions/view';
import { MONEY_TRANSFET_MODAL, DEPOSIT_NAME, WITHDRAW_NAME } from '../modal'

export default connect((state) => ({ moneyWallet: state.asset.moneyWallets.find((a) => a.id === state.view.moneyWalletSelectedId) || state.asset.moneyWallets[0], role: state.account.accountData.role }), { setModalOpenName })(class extends Component {
  render() {
    const { moneyWallet, role } = this.props
    return (
      !moneyWallet ? null :
        <Card>
          <CardHeader title='Account Details' subheader={moneyWallet.id} />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow><TableCell variant="head">Balance</TableCell><TableCell colSpan="3">{Number(moneyWallet.balance).toLocaleString()} THB</TableCell></TableRow>
                <TableRow><TableCell variant="head">Owner id</TableCell><TableCell>{moneyWallet.owner.id}</TableCell><TableCell variant="head">Owner name</TableCell><TableCell>{moneyWallet.owner.name}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardContent>
            <MoneyTransferEventsTable />
          </CardContent>
          <CardActions>
            <Grid container alignItems="center" justify="center" spacing={32}>
              {!role.isGateway ? <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(MONEY_TRANSFET_MODAL)}>Transfer</Button></Grid> : null}
              {role.isGateway ? <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(DEPOSIT_NAME)}>Deposit</Button></Grid> : null}
              {role.isGateway ? <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(WITHDRAW_NAME)}>Withdraw</Button></Grid> : null}
            </Grid>
          </CardActions>
        </Card>
    )
  }
})
