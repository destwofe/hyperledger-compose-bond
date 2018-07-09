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
    Axios.get(`http://localhost:3335/api/bonds/${this.props.match.params.id}`, { headers: { accessToken: localStorage.getItem('accessToken') } })
      .then(response => {
        this.setState({ bond: response.data })
      })
  }

  render() {
    console.log(this.state.bond)
    if (this.state.bond) {
      return (
        <div>
          <div className="py-5 text-center">
            <h2>{this.state.bond.symbol}</h2>
            <p className="lead">{this.state.bond.symbol} description Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <th>Symbol</th>
                <td>{this.state.bond.symbol}</td>
              </tr>
              <tr>
                <th>Par Value</th>
                <td>{Number(this.state.bond.parValue).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Coupon Rate</th>
                <td>{this.state.bond.couponRate}%</td>
              </tr>
              <tr>
                <th>Payment Frequency</th>
                <td>{this.state.bond.paymentFrequency}</td>
              </tr>
              <tr>
                <th>Issue Date</th>
                <td>{(new Date(this.state.bond.issueDate)).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Maturity Date</th>
                <td>{(new Date(this.state.bond.maturity)).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Total Supply</th>
                <td>{Number(this.state.bond.totalSupply).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Issuer</th>
                <td>{this.state.bond.issuer.name}</td>
              </tr>
              {this.state.bond.couponPayout.length > 0 ? <tr>
                <th>Coupon Payout Logs</th>
                <td>{this.state.bond.couponPayout.map(a => (<div key={a.transactionId}><a href={`/bonds/payout/${a.transactionId}`}>{a.transactionId}</a><br /></div>))}</td>
              </tr> : null}
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
