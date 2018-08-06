import Axios from 'axios'
import { BASE_URL } from '.'

export const FETCH_BOND_SUCCESS = 'FETCH_BOND_SUCCESS'
export const fetchBond = () => async (dispatch, getState) => {
  try {
    const { data } = await Axios.get(`${BASE_URL}/api/bonds?resolve=true`)
    dispatch({ type: FETCH_BOND_SUCCESS, payload: data.sort((a, b) => a.symbol.localeCompare(b.symbol)) })
    return Promise.resolve(data)
  } catch (error) {
    // NotificationManager.error(error.toString(), 'Fetch Bond')
  }
}

export const FETCH_BOND_WALLET_SUCCESS = 'FETCH_BOND_WALLET_SUCCESS'
export const fetchBondWallet = (bondId) => async (dispatch, getState) => {
  try {
    const URI = `${BASE_URL}/api/bondwallets?resolve=true`
    const { data } = await Axios.get(URI)
    dispatch({ type: FETCH_BOND_WALLET_SUCCESS, payload: data })
    return Promise.resolve(data)
  } catch (error) {
    // NotificationManager.error(error.toString(), 'Fetch Bond Wallet')
  }
}

export const FETCH_MONEY_WALLET_SUCCESS = 'FETCH_MONEY_WALLET_SUCCESS'
export const fetchMoneyWallet = () => async (dispatch) => {
  try {
    const { data } = await Axios.get(`${BASE_URL}/api/moneywallets?resolve=true`)
    dispatch({ type: FETCH_MONEY_WALLET_SUCCESS, payload: data })
    return Promise.resolve(data)
  } catch (error) {
    // NotificationManager.error(error.toString(), 'Fetch Money Wallet')
  }
}

export const createMoneyWallet = () => async (dispatch) => {
  try {
    const { data } = await Axios.post(`${BASE_URL}/api/moneywallets`)
    fetchMoneyWallet()(dispatch)
    return Promise.resolve(data)
  } catch (error) {
    // NotificationManager.error(error.toString(), 'Create Money Wallet')
  }
}

export const createBondWallet = ({ bond, couponWallet }) => async (dispatch) => {
  try {
    const { data } = await Axios.post(`${BASE_URL}/api/bondwallets`, { bond, couponWallet })
    fetchBondWallet()(dispatch)
    return Promise.resolve(data)
  } catch (error) {
    // NotificationManager.error(error.toString(), 'Create Bond Wallet')
  }
}