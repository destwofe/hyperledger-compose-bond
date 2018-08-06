import Axios from 'axios'

import { BASE_URL } from ".";
import { FETCH_BOND_SUCCESS, FETCH_BOND_WALLET_SUCCESS, FETCH_MONEY_WALLET_SUCCESS } from './asset';
import { FETCH_MONEY_TRANSFER_EVENT_SUCCESS, FETCH_BOND_TRANSFER_EVENT_SUCCESS } from './events';
import { getSafe } from '../utils';

export const FETCH_BOND_PAGE_START = 'FETCH_BOND_PAGE_START'
export const FETCH_BOND_PAGE_SUCCESS = 'FETCH_BOND_PAGE_SUCCESS'
export const bondsPage = () => (dispatch, getState) => {
  if (!getSafe(() => getState().loading.isFetchingBondPage)) {
    dispatch({ type: FETCH_BOND_PAGE_START })
    return Axios.get(`${BASE_URL}/api/graph/bonds`)
      .then(response => {
        dispatch({
          type: FETCH_BOND_SUCCESS,
          payload: response.data.bonds
        })
        dispatch({
          type: FETCH_BOND_WALLET_SUCCESS,
          payload: response.data.bondWallets
        })
        dispatch({
          type: FETCH_MONEY_WALLET_SUCCESS,
          payload: response.data.moneyWallets
        })
        dispatch({ type: FETCH_BOND_PAGE_SUCCESS })
        return response.data
      })
      .catch(error => dispatch({ type: FETCH_BOND_PAGE_SUCCESS }))
  }
}

export const FETCH_BOND_WALLET_PAGE_START = 'FETCH_BOND_WALLET_PAGE_START'
export const FETCH_BOND_WALLET_PAGE_SUCCESS = 'FETCH_BOND_WALLET_PAGE_SUCCESS'
export const bondWalletsPage = () => (dispatch, getState) => {
  if (!getSafe(() => getState().loading.isFetchingBondWalletPage)) {
    dispatch({ type: FETCH_BOND_WALLET_PAGE_START })
    Axios.get(`${BASE_URL}/api/graph/bondwallets`)
      .then(response => {
        dispatch({
          type: FETCH_BOND_WALLET_SUCCESS,
          payload: response.data.bondWallets
        })
        dispatch({
          type: FETCH_BOND_TRANSFER_EVENT_SUCCESS,
          payload: response.data.bondTransferEvents
        })
        dispatch({ type: FETCH_BOND_WALLET_PAGE_SUCCESS })
        return response.data
      })
      .catch(error => dispatch({ type: FETCH_BOND_WALLET_PAGE_SUCCESS }))
  }
}

export const FETCH_MONEY_WALLET_PAGE_START = 'FETCH_MONEY_WALLET_PAGE_START'
export const FETCH_MONEY_WALLET_PAGE_SUCCESS = 'FETCH_MONEY_WALLET_PAGE_SUCCESS'
export const moneyWalletsPage = () => (dispatch, getState) => {
  if (!getSafe(() => getState().loading.isFetchingMoneyWalletPage)) {
    dispatch({ type: FETCH_MONEY_WALLET_PAGE_START })
    Axios.get(`${BASE_URL}/api/graph/moneywallets`)
      .then(response => {
        dispatch({
          type: FETCH_MONEY_WALLET_SUCCESS,
          payload: response.data.moneyWallets
        })
        dispatch({
          type: FETCH_MONEY_TRANSFER_EVENT_SUCCESS,
          payload: response.data.moneyTransferEvents
        })
        dispatch({ type: FETCH_MONEY_WALLET_PAGE_SUCCESS })
      })
      .catch(error => dispatch({ type: FETCH_MONEY_WALLET_PAGE_SUCCESS }))
  }
}