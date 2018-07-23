import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import BondList from '../list/bond'
import BondDetails from "../details/bond";

export default (props) => (
  <Grid container>
    <Grid item sm={3}>
      <Paper style={{ marginTop: 10, marginRight: 5 }}>
        <BondList />
      </Paper>
    </Grid>
    <Grid item sm={9}>
      <Paper style={{ marginTop: 10, marginLeft: 5 }}>
        <BondDetails />
      </Paper>
    </Grid>
  </Grid>)
