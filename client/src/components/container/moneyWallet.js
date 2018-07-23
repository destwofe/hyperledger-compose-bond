import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import MoneyWalletList from '../list/moneyWallet'
import MoneyWalletListDetails from "../details/moneyWallet";

export default (props) => (
  <Grid container>
    <Grid item sm={3}>
      <Paper style={{ marginTop: 10, marginRight: 5 }}>
        <MoneyWalletList />
      </Paper>
    </Grid>
    <Grid item sm={9}>
      <Paper style={{ marginTop: 10, marginLeft: 5 }}>
        <MoneyWalletListDetails />
      </Paper>
    </Grid>
  </Grid>)
