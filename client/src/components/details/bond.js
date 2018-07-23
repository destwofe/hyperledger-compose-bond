import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, Typography, CardContent, Table, TableBody, TableRow, TableCell, TableHead, CardActions, Button, Grid, TableFooter } from '@material-ui/core'

import BondHoldersTable from '../table/bondHolders'
import BondCouponPayoutTransactionsTable from '../table/bondCouponPayoutTransactions'

import { fetchBondSubscriptionContract } from '../../actions/asset'
import { setModalOpenName, setSubscriptionContractSelectedId } from '../../actions/view'
import { submitSubscriptionCloseSaleTransaction } from '../../actions/transaction'
import { getSafe } from '../../utils';
import { SUBSCRIPTION_MODAL, COUPON_PAYOUY_NAME, BOND_BUYBACK_NAME } from '../modal/'

const mapStateToProps = (state) => {
  const bond = state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0]
  const subsctiptionContracts = getSafe(() => state.asset.subscriptionContract.filter(a => a.bond.id === bond.id))
  const role = state.account.accountData.role
  const accountId = `resource:${state.account.accountData.$class}#${state.account.accountData.id}`

  return { bond, subsctiptionContracts, role, accountId }
}

export default connect(mapStateToProps, { fetchBondSubscriptionContract, setModalOpenName, setSubscriptionContractSelectedId, submitSubscriptionCloseSaleTransaction })(class extends Component {
  componentDidMount() {
    if (getSafe(() => this.props.bond.id)) this.props.fetchBondSubscriptionContract(this.props.bond.id)
  }

  render() {
    const { bond, subsctiptionContracts, role, accountId } = this.props
    return (
      bond ?
        <Card>
          <CardHeader title={bond.symbol} subheader={bond.id} />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow><TableCell colSpan="4"><Typography variant="subheading">Details</Typography></TableCell></TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell variant="head">Symbol</TableCell><TableCell>{bond.symbol}</TableCell><TableCell variant="head">Issuer</TableCell><TableCell>{bond.issuer.replace('resource:org.tbma.Account#', '')}</TableCell></TableRow>
                <TableRow><TableCell variant="head">Par Value</TableCell><TableCell>{Number(bond.parValue).toLocaleString()}</TableCell><TableCell variant="head">Issue Size</TableCell><TableCell>{Number(bond.totalSupply).toLocaleString()}</TableCell></TableRow>
                <TableRow><TableCell variant="head">Issue Date</TableCell><TableCell>{new Date(bond.issueDate).toLocaleDateString()}</TableCell><TableCell variant="head">Maturity Date</TableCell><TableCell>{new Date(bond.maturityDate).toLocaleDateString()}</TableCell></TableRow>
                <TableRow><TableCell variant="head">Coupon Rate</TableCell><TableCell>{bond.couponRate} %</TableCell><TableCell variant="head">Payment Frequency</TableCell><TableCell>{bond.paymentFrequency}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
          {getSafe(() => subsctiptionContracts.length) > 0 ? <CardContent><Typography variant="subheading">Subscription Contract</Typography></CardContent> : null}
          {getSafe(() => subsctiptionContracts.length) > 0 ? subsctiptionContracts.map(contract =>
            <CardContent key={contract.id} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <Table>
                <TableHead>
                  <TableRow style={{ height: 0 }}><TableCell colSpan="4">
                    <Grid container alignItems='flex-end' spacing={8}>
                      <Grid item><Typography variant="body1">Contract ID: </Typography></Grid>
                      <Grid item><Typography variant="caption" style={{paddingBottom: 1}}>{contract.id}</Typography></Grid>
                    </Grid>
                  </TableCell></TableRow>
                </TableHead>
                <TableBody>
                  <TableRow><TableCell>Selling status</TableCell><TableCell>{contract.isCloseSale ? 'Closed Sale' : 'On Sale'}</TableCell><TableCell>Sold Amount</TableCell><TableCell>{Number(contract.soldAmount).toLocaleString()} unit</TableCell></TableRow>
                  <TableRow><TableCell>Hard Cap</TableCell><TableCell>{Number(contract.hardCap).toLocaleString()} unit</TableCell><TableCell>Remain Amount</TableCell><TableCell>{Number(contract.hardCap-contract.soldAmount).toLocaleString()} unit</TableCell></TableRow>
                </TableBody>
                {role.isGateway || contract.isCloseSale || (role.isIssuer && bond.issuer !== accountId) ? null : <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}><Grid container justify="center" spacing={32}>
                    {!role.isIssuer || bond.issuer !== accountId ? null : <Grid item><Button variant='contained' onClick={() => this.props.submitSubscriptionCloseSaleTransaction({ subscriptionContract: contract.id })}>Close Sale</Button></Grid>}
                    {!role.isInvestor ? null : <Grid item><Button variant='contained' onClick={() => {this.props.setModalOpenName(SUBSCRIPTION_MODAL); this.props.setSubscriptionContractSelectedId(contract.id) }}>Subscribe</Button></Grid>}
                    </Grid></TableCell>
                  </TableRow>
                </TableFooter>}
              </Table>
            </CardContent>) : null}
          <CardContent>
            <BondHoldersTable />
            <BondCouponPayoutTransactionsTable />
          </CardContent>
          {bond.isMature && false ? null : <CardActions style={{borderTopStyle: 'ridge'}}>
            <Grid container alignItems="center" justify="center" spacing={32}>
              {!role.isIssuer || bond.issuer !== accountId ? null : <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(COUPON_PAYOUY_NAME)}>Coupon Payout</Button></Grid>}
              {!role.isIssuer || bond.issuer !== accountId ? null : <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(BOND_BUYBACK_NAME)}>Call Back</Button></Grid>}
            </Grid>
          </CardActions>}
        </Card>
        : null)
  }
})
