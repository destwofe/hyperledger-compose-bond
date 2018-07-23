import { LOGOUT_SUCCESS } from '../actions/account'
import { TAB_CHANGE, SET_MODAL_OPEN_NAME, SET_TRANSACTION_SELECTED_ID, SET_BOND_SELECTED_ID, SET_MONEY_WALLET_SELECTED_ID, SET_SUBSCRIPTION_CONTRACT_SELECTED_ID, SET_BOND_WALLET_SELECTED_ID } from '../actions/view'

const initialState = {
  tabNumber: 0,
  modalOpenName: null,
  bondSelectedId: null, bondWalletSelectedId: null, moneyWalletSelectedId: null, transactionSelectedId: null, subscriptionContractSelectedId: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case TAB_CHANGE:
      return { ...state, ...payload }
    case SET_MODAL_OPEN_NAME:
      return { ...state, modalOpenName: payload }
    case SET_TRANSACTION_SELECTED_ID:
      return { ...state, transactionSelectedId: payload }
    case SET_BOND_SELECTED_ID:
      return { ...state, bondSelectedId: payload }
    case SET_BOND_WALLET_SELECTED_ID:
      return { ...state, bondWalletSelectedId: payload }
    case SET_MONEY_WALLET_SELECTED_ID:
      return { ...state, moneyWalletSelectedId: payload }
    case SET_SUBSCRIPTION_CONTRACT_SELECTED_ID:
      return { ...state, subscriptionContractSelectedId: payload }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
