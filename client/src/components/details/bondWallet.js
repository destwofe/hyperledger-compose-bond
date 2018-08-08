import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardContent, Table, TableBody, TableRow, TableCell, CardActions, Grid, Button } from '@material-ui/core'

import BondTransferEventsTable from '../table/bondTransferEvents'
import { setModalOpenName } from '../../actions/view';
import { BOND_TRANSFER_MODAL } from '../modal'

export default connect((state) => ({ bondWallet: state.asset.bondWallets.find((a) => a.id === state.view.bondWalletSelectedId) || state.asset.bondWallets[0], role: state.account.accountData.role }), { setModalOpenName })(class extends Component {
  render() {
    const { bondWallet, role } = this.props
    return (
      !bondWallet ? null :
        <Card>
          <CardHeader title='Account Details' subheader={bondWallet.id} />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow><TableCell variant="head">Bond</TableCell><TableCell>{bondWallet.bond.symbol}</TableCell><TableCell variant="head">Balance</TableCell><TableCell>{Number(bondWallet.balance).toLocaleString()} unit</TableCell></TableRow>
                <TableRow><TableCell variant="head">Owner id</TableCell><TableCell>{bondWallet.owner.id}</TableCell><TableCell variant="head">Owner name</TableCell><TableCell>{bondWallet.owner.name}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardContent>
            <BondTransferEventsTable />
          </CardContent>
          <CardActions>
            <Grid container alignItems="center" justify="center" spacing={32}>
              {role.isInvestor ? <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(BOND_TRANSFER_MODAL)}>Transfer</Button></Grid> : null}
            </Grid>
          </CardActions>
        </Card>
    )
  }
})
