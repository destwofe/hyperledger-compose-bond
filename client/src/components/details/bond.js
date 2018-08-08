import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, Typography, CardContent, Table, TableBody, TableRow, TableCell, TableHead, CardActions, Button, Grid, TableFooter, Collapse } from '@material-ui/core'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

import BondHoldersTable from '../table/bondHolders'
import Subscripers from '../table/subscripers';
import BondCouponPayoutTransactionsTable from '../table/bondCouponPayoutTransactions'

import { setModalOpenName } from '../../actions/view'
import { submitSubscriptionCloseSaleTransaction } from '../../actions/transaction'
import { SUBSCRIPTION_MODAL, BOND_BOOK_CLOSE_NAME, BOND_BUYBACK_NAME } from '../modal/'
import { getSafe } from '../../utils';

const mapStateToProps = (state) => {
  const role = state.account.accountData.role
  const accountId = state.account.accountData.id

  const bond = state.asset.bonds.find((a) => a.id === state.view.bondSelectedId) || state.asset.bonds[0]

  return { role, accountId, bond }
}

export default connect(mapStateToProps, { setModalOpenName, submitSubscriptionCloseSaleTransaction })(class extends Component {
  state = {
    isSubscriptionContractCollapseOpen: false,
    isBondHoldersCollapseOpen: false,
    isBondCouponPayoutTransactionCollapseOpen: false
  }

  handlerCollapse = (item) => {
    switch (item) {
      case 'subscriper':
        if (this.state.isSubscriptionContractCollapseOpen) {
          this.setState({ isSubscriptionContractCollapseOpen: false })
        } else {
          this.setState({ isSubscriptionContractCollapseOpen: true, isBondHoldersCollapseOpen: false, isBondCouponPayoutTransactionCollapseOpen: false })
        } break;
      case 'holder':
        if (this.state.isBondHoldersCollapseOpen) {
          this.setState({ isBondHoldersCollapseOpen: false })
        } else {
          this.setState({ isSubscriptionContractCollapseOpen: false, isBondHoldersCollapseOpen: true, isBondCouponPayoutTransactionCollapseOpen: false })
        } break;
      case 'coupon':
        if (this.state.isBondCouponPayoutTransactionCollapseOpen) {
          this.setState({ isBondCouponPayoutTransactionCollapseOpen: false })
        } else {
          this.setState({ isSubscriptionContractCollapseOpen: false, isBondHoldersCollapseOpen: false, isBondCouponPayoutTransactionCollapseOpen: true })
        } break;
      default:
    }
  }

  render() {
    const { bond } = this.props
    if (bond) {
      const { bond: { subscriptionContract: contract }, role, accountId } = this.props
      return <Card>
        <CardHeader title={bond.symbol} subheader={bond.id} />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow><TableCell colSpan="4"><Typography variant="subheading">Details</Typography></TableCell></TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell variant="head">Symbol</TableCell><TableCell>{bond.symbol}</TableCell><TableCell variant="head">Issuer</TableCell><TableCell>{getSafe(() => bond.issuer.name) || 'permission denined'}</TableCell></TableRow>
              <TableRow><TableCell variant="head">Par Value</TableCell><TableCell>{Number(bond.parValue).toLocaleString()}</TableCell><TableCell variant="head">Issue Size</TableCell><TableCell>{Number(bond.totalSupply).toLocaleString()}</TableCell></TableRow>
              <TableRow><TableCell variant="head">Issue Date</TableCell><TableCell>{new Date(bond.issueDate).toLocaleDateString()}</TableCell><TableCell variant="head">Maturity Date</TableCell><TableCell>{new Date(bond.maturityDate).toLocaleDateString()}</TableCell></TableRow>
              <TableRow><TableCell variant="head">Coupon Rate</TableCell><TableCell>{bond.couponRate} %</TableCell><TableCell variant="head">Payment Frequency</TableCell><TableCell>{bond.paymentFrequency}</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardContent>
          <Grid container justify='center'>
            <Grid item><Button style={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => this.handlerCollapse('subscriper')}><Grid container alignItems='center'><Grid item><Typography variant="subheading">Subscription Contract</Typography></Grid><Grid item><Typography variant='caption'>{this.state.isSubscriptionContractCollapseOpen ? <ExpandLess style={{ padding: 0 }} /> : <ExpandMore style={{ padding: 0 }} />}</Typography></Grid></Grid></Button></Grid>
            <Grid item><Button style={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => this.handlerCollapse('holder')}><Grid container alignItems='center'><Grid item><Typography variant="subheading">Bond Holders</Typography></Grid><Grid item><Typography variant='caption'>{this.state.isBondHoldersCollapseOpen ? <ExpandLess style={{ padding: 0 }} /> : <ExpandMore style={{ padding: 0 }} />}</Typography></Grid></Grid></Button></Grid>
            <Grid item><Button style={{ paddingTop: 0, paddingBottom: 0 }} onClick={() => this.handlerCollapse('coupon')}><Grid container alignItems='center'><Grid item><Typography variant="subheading">Book closing reports</Typography></Grid><Grid item><Typography variant='caption'>{this.state.isBondCouponPayoutTransactionCollapseOpen ? <ExpandLess style={{ padding: 0 }} /> : <ExpandMore style={{ padding: 0 }} />}</Typography></Grid></Grid></Button></Grid>
          </Grid>
          <Collapse in={this.state.isSubscriptionContractCollapseOpen}>
            {this.state.isSubscriptionContractCollapseOpen ? <SubscriptionContract contract={contract} role={role} accountId={accountId} bond={bond} setModalOpenName={this.props.setModalOpenName} submitSubscriptionCloseSaleTransaction={this.props.submitSubscriptionCloseSaleTransaction} /> : null}
          </Collapse>
          <Collapse in={this.state.isBondHoldersCollapseOpen}>
            {this.state.isBondHoldersCollapseOpen ? <BondHoldersTable /> : null}
          </Collapse>
          <Collapse in={this.state.isBondCouponPayoutTransactionCollapseOpen}>
            {this.state.isBondCouponPayoutTransactionCollapseOpen ? <BondCouponPayoutTransactionsTable /> : null}
          </Collapse>
        </CardContent>
        {getSafe(() => bond.issuer.id) !== accountId || bond.isMature ? null : <CardActions style={{ borderTopStyle: 'ridge' }}>
          <Grid container alignItems="center" justify="center" spacing={32}>
            <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(BOND_BOOK_CLOSE_NAME)}>Book close</Button></Grid>
            <Grid item><Button variant="contained" onClick={() => this.props.setModalOpenName(BOND_BUYBACK_NAME)}>Call Back</Button></Grid>
          </Grid>
        </CardActions>}
      </Card>
    }
    return null
  }
})

class SubscriptionContract extends Component {
  state = {
    isCollapseOpen: false
  }

  render() {
    const { contract, role, accountId, bond, setModalOpenName, submitSubscriptionCloseSaleTransaction } = this.props
    return <CardContent key={contract.id} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Table>
        <TableBody>
          <TableRow><TableCell variant="head">Selling status</TableCell><TableCell>{contract.isCloseSale ? 'Closed Sale' : 'On Sale'}</TableCell><TableCell variant="head">Sold Amount</TableCell><TableCell>{Number(contract.soldAmount).toLocaleString()} unit</TableCell></TableRow>
          <TableRow><TableCell variant="head">Sale Amount</TableCell><TableCell>{Number(contract.hardCap).toLocaleString()} unit</TableCell><TableCell variant="head">Remain Amount</TableCell><TableCell>{Number(contract.hardCap - contract.soldAmount).toLocaleString()} unit</TableCell></TableRow>
          <TableRow><TableCell><Button color="primary" onClick={() => this.setState({ isCollapseOpen: !this.state.isCollapseOpen })} style={{ padding: 0 }}>Subscripers({contract.subscripers.length})</Button></TableCell><TableCell colSpan={3}><Collapse in={this.state.isCollapseOpen}><Subscripers /></Collapse></TableCell></TableRow>
        </TableBody>
        {role.isGateway || contract.isCloseSale ? null : <TableFooter>
          <TableRow>
            <TableCell colSpan={4}><Grid container justify="center" spacing={32}>
              {!role.isIssuer || bond.issuer.id !== accountId ? null : <Grid item><Button variant='contained' onClick={() => submitSubscriptionCloseSaleTransaction({ bond: bond.id })}>Close Sale</Button></Grid>}
              {!role.isInvestor ? null : <Grid item><Button variant='contained' onClick={() => { setModalOpenName(SUBSCRIPTION_MODAL) }}>Subscribe</Button></Grid>}
            </Grid></TableCell>
          </TableRow>
        </TableFooter>}
      </Table>
    </CardContent>
  }
}
