import React from 'react'

import { Paper, Tabs, Tab } from '@material-ui/core'

export default (props) =>
  <Paper>
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      centered
      value={0}
    >
      <Tab label="Bonds" />
      <Tab label="Bond Accounts" />
      <Tab label="Money Accounts" />
    </Tabs>
  </Paper>