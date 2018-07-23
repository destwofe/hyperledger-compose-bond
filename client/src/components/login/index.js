import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestLogin } from '../../actions/account'

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
    return (<div>
      {this.props.account.accessToken}
      <input type="text" defaultValue={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
      <button onClick={() => this.handlerLoginButton()}>Login</button>
    </div>)
  }
}

const mapStateToProps = (state) => ({ account: state.account })

export default connect(mapStateToProps, { requestLogin })(Login)
