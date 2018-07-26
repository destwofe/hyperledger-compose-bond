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
      <Tab label="Depository Accounts" />
      <Tab label="Bank Accounts" />
    </Tabs>
  </Paper>