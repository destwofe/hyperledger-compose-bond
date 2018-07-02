import React, { Component } from 'react'
import Axios from 'axios'

class BondDetails extends Component {
  constructor(props) {
    super()
    this.state = {
      bond: null
    }
  }

  componentDidMount() {
    this.fetchBondInfo()
  }

  fetchBondInfo = () => {
    Axios.get(`http://api.destwofe.xyz/api/bonds/${this.props.match.params.id}`, { headers: { accessToken: localStorage.getItem('accessToken') } })
      .then(response => {
        this.setState({ bond: response.data })
      })
  }

  render() {
    if (this.state.bond) {
      return (
        <div>
          <div className="py-5 text-center">
            <h2>{this.state.bond.symbole}</h2>
            <p className="lead">{this.state.bond.symbole} description Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <th>Symbole</th>
                <td>{this.state.bond.symbole}</td>
              </tr>
              <tr>
                <th>Par Value</th>
                <td>{this.state.bond.parValue}</td>
              </tr>
              <tr>
                <th>Coupon Rate</th>
                <td>{this.state.bond.couponRate}%</td>
              </tr>
              <tr>
                <th>Payment Period</th>
                <td>{this.state.bond.paymentFrequency.periodMultipier}</td>
              </tr>
              <tr>
                <th>Payment Period Multiplier</th>
                <td>{this.state.bond.paymentFrequency.period}</td>
              </tr>
              <tr>
                <th>Maturity</th>
                <td>{this.state.bond.maturity}</td>
              </tr>
              <tr>
                <th>Total Supply</th>
                <td>{this.state.bond.totalSupply}</td>
              </tr>
              <tr>
                <th>Issuer</th>
                <td>{this.state.bond.issuer.replace(/resource:org.tbma.Account#/g, '')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <div className="text-center my-5"><h1>Loading . . .</h1></div>
    }
  }
}

export default BondDetails
