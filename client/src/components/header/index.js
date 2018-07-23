import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, IconButton, Paper, Tabs, Tab, Menu, MenuItem } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

import { tabChange } from '../../actions/view'
import { requestLogout } from '../../actions/account'

export default connect((state) => ({ view: state.view }), { tabChange, requestLogout })(class extends Component {
  state = {
    anchorEl: null
  }

  render() {
    return <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="headline" color="inherit" style={{ flex: 1 }}>
            Bond Book
          </Typography>
          <Typography variant="headline" color="inherit">
          </Typography>
          <IconButton onClick={(event) => this.setState({anchorEl: event.currentTarget})} color="inherit">
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
            onClose={() => this.setState({anchorEl: null})}
          >
            <MenuItem onClick={() => {}}>Profile</MenuItem>
            <MenuItem onClick={() => this.props.requestLogout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Paper>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          centered
          value={this.props.view.tabNumber}
        >
          <Tab label="Bonds" onClick={() => this.props.tabChange(0)} />
          <Tab label="Bond Wallets" onClick={() => this.props.tabChange(1)} />
          <Tab label="Money Wallets" onClick={() => this.props.tabChange(2)} />
        </Tabs>
      </Paper>
    </div>
  }
})