import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, IconButton, Paper, Tabs, Tab, Menu, MenuItem, LinearProgress } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

import { tabChange } from '../../actions/view'
import { requestLogout } from '../../actions/account'
import { getSafe } from '../../utils';

export default connect((state) => ({ view: state.view, role: state.account.accountData.role, accountData: state.account.accountData, globalLoading: getSafe(() => state.loading.globalLoading) || 0 }), { tabChange, requestLogout })(class extends Component {
  state = {
    anchorEl: null
  }

  getRoleName = (role) => {
    if (role.isInvestor) return 'investor'
    if (role.isIssuer) return 'issuer'
    if (role.isGateway) return 'gateway'
  }

  render() {
    const { role, accountData } = this.props
    return <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="headline" color="inherit" style={{ flex: 1 }}>
            Bond Book
          </Typography>
          <Typography variant="title" color="inherit">
            {accountData.name}
            {` (${this.getRoleName(role)})`}
          </Typography>
          <IconButton onClick={(event) => this.setState({ anchorEl: event.currentTarget })} color="inherit">
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={this.state.anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={this.state.anchorEl != null}
            onClose={() => this.setState({ anchorEl: null })}
          >
            <MenuItem onClick={() => { }}>Profile</MenuItem>
            <MenuItem onClick={() => this.props.requestLogout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {this.props.globalLoading > 0 ? <LinearProgress /> : null}
      <Paper>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          centered
          value={this.props.view.tabNumber}
        >
          <Tab label="Bonds" disabled={role.isGateway} onClick={() => this.props.tabChange(0)} />
          <Tab label="Depository Accounts" disabled={role.isGateway} onClick={() => this.props.tabChange(1)} />
          <Tab label="Bank Accounts" onClick={() => this.props.tabChange(2)} />
        </Tabs>
      </Paper>
    </div>
  }
})