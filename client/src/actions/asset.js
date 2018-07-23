import Axios from 'axios'
import { BASE_URL } from '.'
import { getSafe } from '../utils';

export const FETCH_BOND_SUCCESS = 'FETCH_BOND_SUCCESS'
export const fetchBond = () => async (dispatch, getState) => {
  const { data } = await Axios.get(`${BASE_URL}/api/bonds`)
  dispatch({ type: FETCH_BOND_SUCCESS, payload: data.sort((a, b) => a.symbol.localeCompare(b.symbol)) })
  return Promise.resolve(data)
}

export const FETCH_BOND_SUBSCRIPTION_CONTRACT_SUCCESS = 'FETCH_BOND_SUBSCRIPTION_CONTRACT_SUCCESS'
export const fetchBondSubscriptionContract = (bondId) => async (dispatch) => {
  const { data } = await Axios.get(`${BASE_URL}/api/bondSubscriptionContracts?bondId=${bondId}`)
  dispatch({ type: FETCH_BOND_SUBSCRIPTION_CONTRACT_SUCCESS, payload: data })
  return Promise.resolve(data)
}

export const FETCH_BOND_WALLET_SUCCESS = 'FETCH_BOND_WALLET_SUCCESS'
export const fetchBondWallet = (bondId) => async (dispatch, getState) => {
  const isIssuer = getSafe(() => getState().account.accountData.role.isIssuer)
  const URI = isIssuer ? `${BASE_URL}/api/bondwallets` : bondId ? `${BASE_URL}/api/bondwallets?filter=bond&&bond=${bondId}` : `${BASE_URL}/api/bondwallets?filter=owner`
  const { data } = await Axios.get(URI)
  dispatch({ type: FETCH_BOND_WALLET_SUCCESS, payload: data })
  return Promise.resolve(data)
}

export const FETCH_MONEY_WALLET_SUCCESS = 'FETCH_MONEY_WALLET_SUCCESS'
export const fetchMoneyWallet = () => async (dispatch) => {
  const { data } = await Axios.get(`${BASE_URL}/api/moneywallets`)
  dispatch({ type: FETCH_MONEY_WALLET_SUCCESS, payload: data })
  return Promise.resolve(data)
}

export const createMoneyWallet = () => async (dispatch) => {
  const { data } = await Axios.post(`${BASE_URL}/api/moneywallets`)
  fetchMoneyWallet()(dispatch)
  return Promise.resolve(data)
}

export const createBondWallet = ({ bond, couponWallet }) => async (dispatch) => {
  const { data } = await Axios.post(`${BASE_URL}/api/bondwallets`, { bond, couponWallet })
  fetchBondWallet()(dispatch)
  return Promise.resolve(data)
}