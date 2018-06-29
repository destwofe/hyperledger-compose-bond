import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Axios from 'axios'

class Homepage extends Component {
  constructor(props) {
    super()
    this.state = {
      accessToken: ''
    }
  }

  onInputChange = (newState) => {
    this.setState(newState)
  }

  saveSome = (event) => {
    event.preventDefault()
    Axios.get('http://localhost:3335/api/account', { headers: { accessToken:  this.state.accessToken} })
      .then(response => {
        localStorage.setItem('accessToken', this.state.accessToken)
        localStorage.setItem('email', response.data.email)
        localStorage.setItem('name', response.data.name)
        window.location.reload()
      }).catch(console.log)
  }

  renderLoginForm = () => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      return (
        <form className="form-inline" onSubmit={() => { localStorage.removeItem('accessToken') }}>
          <span className="mr-sm-2">{accessToken}</span>
          <button className="btn btn-outline-success mr-sm-2" type="submit">Logout</button>
        </form>
      )
    }
    return (
      <form className="form-inline" onSubmit={this.saveSome}>
        <input className="form-control mr-sm-2" type="text" placeholder="access token" onChange={(event) => this.onInputChange({ accessToken: event.target.value })} />
        <button className="btn btn-outline-success mr-sm-2" type="submit">Login</button>
      </form>
    )
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Homepage</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/bonds">Bonds</Link>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true">Wallets</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" to="/wallets/moneywallets">Money Wallets</Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" to="/wallets/bondwallets">Bond Wallets</Link>
            </div>
          </li>
        </ul>
        {this.renderLoginForm()}
      </nav>
    )
  }
}

export default Homepage