import { BASE_URL } from ".";
import Axios from 'axios'


export const FETCH_MONEY_TRANSFER_EVENT_SUCCESS = 'FETCH_MONEY_TRANSFER_EVENT_SUCCESS'
export const fetchMoneyTransferEvents = (moneyWalletId) => (dispatch) =>
  Axios.get(`${BASE_URL}/api/events/moneytransfer?moneyWallet=${moneyWalletId}`)
    .then(response => {
      dispatch({
        type: FETCH_MONEY_TRANSFER_EVENT_SUCCESS,
        payload: response.data
      })
      return response.data
    })

export const FETCH_BOND_TRANSFER_EVENT_SUCCESS = 'FETCH_BOND_TRANSFER_EVENT_SUCCESS'
export const fetchBondTransferEvents = (bondWalletId) => async (dispatch) =>
  Axios.get(`${BASE_URL}/api/events/bondtransfer?bondWallet=${bondWalletId}`)
    .then(response => {
      dispatch({ type: FETCH_BOND_TRANSFER_EVENT_SUCCESS, payload: response.data })
      return response.data
    })
