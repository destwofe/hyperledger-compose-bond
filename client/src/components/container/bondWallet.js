import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import BondWalletList from '../list/bondWallet'
import BondWalletListDetails from "../details/bondWallet";

export default (props) => (
  <Grid container>
    <Grid item sm={3}>
      <Paper style={{ marginTop: 10, marginRight: 5 }}>
        <BondWalletList />
      </Paper>
    </Grid>
    <Grid item sm={9}>
      <Paper style={{ marginTop: 10, marginLeft: 5 }}>
        <BondWalletListDetails />
      </Paper>
    </Grid>
  </Grid>)
