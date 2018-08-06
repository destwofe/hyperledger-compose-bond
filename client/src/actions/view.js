import { push } from 'react-router-redux'

import { fetchMoneyTransferEvents, fetchBondTransferEvents } from './events'

export const TAB_CHANGE = 'TAB_CHANGE'
export const tabChange = (tabNumber) => (dispatch, getState) => {
  switch (tabNumber) {
    case 0: dispatch(push('/bonds')); break;
    case 1: dispatch(push('/bondwallets')); break;
    case 2: dispatch(push('/moneywallets')); break;
    default: dispatch(push('/bonds')); break;
  }
  dispatch({
    type: TAB_CHANGE,
    payload: {
      tabNumber
    }
  })
}

export const SET_BOND_SELECTED_ID = 'SET_BOND_SELECTED_ID'
export const setBondSelectedId = (bondId) => (dispatch) => Promise.all([
  dispatch({ type: SET_BOND_SELECTED_ID, payload: bondId })
])

export const SET_BOND_WALLET_SELECTED_ID = 'SET_BOND_WALLET_SELECTED_ID'
export const setBondWalletSelectedId = (bondwalletId) => (dispatch) => {
  fetchBondTransferEvents(bondwalletId)(dispatch)
  dispatch({ type: SET_BOND_WALLET_SELECTED_ID, payload: bondwalletId })
}

export const SET_MONEY_WALLET_SELECTED_ID = 'SET_MONEY_WALLET_SELECTED_ID'
export const setMoneyWalletSelectedId = (moneywalletId) => (dispatch) => {
  fetchMoneyTransferEvents(moneywalletId)(dispatch)
  dispatch({ type: SET_MONEY_WALLET_SELECTED_ID, payload: moneywalletId })
}

export const SET_TRANSACTION_SELECTED_ID = 'SET_TRANSACTION_SELECTED_ID'
export const setTransactionSelectedId = (transactionId) => (dispatch) => dispatch({ type: SET_TRANSACTION_SELECTED_ID, payload: transactionId })

export const SET_COUPON_PAYOUT_SELECTED_INDEX = 'SET_COUPON_PAYOUT_SELECTED_INDEX'
export const setCouponPayoutSelectedIndex = (index) => (dispatch) => dispatch({ type: SET_COUPON_PAYOUT_SELECTED_INDEX, payload: index })

export const SET_MODAL_OPEN_NAME = 'SET_MODAL_OPEN_NAME'
export const setModalOpenName = (name) => (dispatch) => dispatch({ type: SET_MODAL_OPEN_NAME, payload: name })
