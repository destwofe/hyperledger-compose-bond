import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableRow, TableCell, TableFooter, TablePagination, Card, CardContent, CardActions, IconButton, Typography, Collapse, Grid, TableHead, TextField, Button } from '@material-ui/core'
import { ExpandMore, ExpandLess } from '@material-ui/icons'

import { fetchBond } from '../../actions/asset'
import { setBondSelectedId, setModalOpenName } from '../../actions/view'
import { ISSUE_BOND_MODAL } from '../modal'

export default connect((state) => ({ bonds: state.asset.bonds }), { fetchBond, setBondSelectedId, setModalOpenName })(class extends Component {
  state = {
    page: 0,
    collapseExpandFor: null,
    filteredBonds: this.props.bonds
  }

  componentDidMount() {
    this.props.fetchBond()
  }

  handlerFilterChange = (event) => {
    const value = event.target.value
    this.setState({filteredBonds: this.props.bonds.filter(a => a.symbol.toLowerCase().indexOf(value) !== -1 || a.issuer.replace('resource:org.tbma.Account#', '').toLowerCase().indexOf(value) !== -1)})
  }

  collapseExpandHandler = (id) => {
    if (this.state.collapseExpandFor === id) {
      this.setState({ collapseExpandFor: null })
    } else {
      this.setState({ collapseExpandFor: id })
    }
  }

  render() {
    const rowsPerPage = 5
    const page = this.state.page

    const bonds = this.props.bonds
    const {filteredBonds} = this.state
    return (<Table>
        {bonds.length <= 0 ? null : <TableHead>
          <TableRow>
            <TableCell>
              <TextField fullWidth label="Search" onChange={this.handlerFilterChange} />
            </TableCell>
          </TableRow>
        </TableHead>}
        {bonds.length <= 0 ? null : <TableBody>
          {filteredBonds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(bond =>
            <TableRow key={bond.id} style={{ height: 0 }} onClick={() => this.props.setBondSelectedId(bond.id)}>
              <TableCell style={{ padding: 0 }}>
                <Card style={{ margin: 0 }}>
                  <CardContent style={{ paddingBottom: 0 }}>
                    <Typography variant="headline" style={{ float: 'left', paddingRight: 10 }}>{bond.symbol}</Typography>
                    <Typography variant="caption" style={{ float: 'inline-end' }}>{bond.id}</Typography>
                  </CardContent>
                  <CardActions style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Typography variant="caption" style={{ paddingLeft: 12 }}>{bond.issuer.replace('resource:org.tbma.Account#', '')}</Typography>
                    <IconButton style={{ marginLeft: 'auto' }} onClick={() => this.collapseExpandHandler(bond.id)} >{this.state.collapseExpandFor === bond.id ? <ExpandLess /> : <ExpandMore />}</IconButton>
                  </CardActions>
                  <Collapse in={this.state.collapseExpandFor === bond.id}>
                    <CardContent>
                      <Grid container style={{ flexGrow: 1 }}>
                        <Grid item sm={6}>Par Value</Grid><Grid item sm={6}>{Number(bond.parValue).toLocaleString()}</Grid>
                        <Grid item sm={6}>Payment Frequency</Grid><Grid item sm={6}>{bond.paymentFrequency}</Grid>
                        <Grid item sm={6}>Issue Size</Grid><Grid item sm={6}>{Number(bond.totalSupply).toLocaleString()}</Grid>
                        <Grid item sm={6}>Issue Date</Grid><Grid item sm={6}>{new Date(bond.issueDate).toLocaleDateString()}</Grid>
                        <Grid item sm={6}>Maturity Date</Grid><Grid item sm={6}>{new Date(bond.maturity).toLocaleDateString()}</Grid>
                      </Grid>
                    </CardContent>
                  </Collapse>
                </Card>
              </TableCell>
            </TableRow>)}
        </TableBody>}
        <TableFooter>
          {bonds.length <= 0 ? null : <TableRow>
            <TablePagination
              count={filteredBonds.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={(event, page) => { this.setState({ page }) }}
              rowsPerPageOptions={[rowsPerPage]}
            />
          </TableRow>}
          <TableRow style={{ height: 0 }}>
            <TableCell style={{ padding: 0 }}>
              <Button color="default" variant="contained" style={{ width: '100%', height: '100%' }} onClick={() => this.props.setModalOpenName(ISSUE_BOND_MODAL)}>Issue Bond</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
})
