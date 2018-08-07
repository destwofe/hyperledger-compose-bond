import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestLogin } from '../../actions/account'
import { Grid, Button, Typography, TextField, Paper } from '@material-ui/core'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ''
    }
  }

  handlerLoginButton = () => {
    this.props.requestLogin(this.state.username)
  }

  render() {
    return (<Paper style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-40%, -50%)', padding: 0, margin: 0 }}>
      <Grid container direction='column' spacing={32} justify='center' alignItems='center' style={{ padding: 30 }}>
        <Grid item><Typography variant='title'>Bond System</Typography><Typography variant='subheading'>base on Hyperledger Fabric Composer</Typography></Grid>
        <Grid item style={{ width: '100%' }}><TextField fullWidth label='Access Token' defaultValue={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} /></Grid>
        <Grid item><Button variant='contained' color='primary' onClick={() => this.handlerLoginButton()}>Login</Button></Grid>
      </Grid>
    </Paper>)
  }
}

const mapStateToProps = (state) => ({ account: state.account })

export default connect(mapStateToProps, { requestLogin })(Login)
