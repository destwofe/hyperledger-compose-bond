import {
  FETCH_BOND_PAGE_START, FETCH_BOND_PAGE_SUCCESS,
  FETCH_BOND_WALLET_PAGE_START, FETCH_BOND_WALLET_PAGE_SUCCESS,
  FETCH_MONEY_WALLET_PAGE_START, FETCH_MONEY_WALLET_PAGE_SUCCESS
} from '../actions/graph'

import {
  GLOBAL_LODING_START, GLOBAL_LOGING_STOP
} from '../actions'

const initialState = {
  isFetchingBondPage: false,
  isFetchingBondWalletPage: false,
  isFetchingMoneyWalletPage: false,
  globalLoading: 0
}
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_BOND_PAGE_START:
      return { ...state, isFetchingBondPage: true }
    case FETCH_BOND_PAGE_SUCCESS:
      return { ...state, isFetchingBondPage: false }
    case FETCH_BOND_WALLET_PAGE_START:
      return { ...state, isFetchingBondWalletPage: true }
    case FETCH_BOND_WALLET_PAGE_SUCCESS:
      return { ...state, isFetchingBondWalletPage: false }
    case FETCH_MONEY_WALLET_PAGE_START:
      return { ...state, isFetchingMoneyWalletPage: true }
    case FETCH_MONEY_WALLET_PAGE_SUCCESS:
      return { ...state, isFetchingMoneyWalletPage: false }
    case GLOBAL_LODING_START:
      return { ...state, globalLoading: state.globalLoading + 1 }
    case GLOBAL_LOGING_STOP:
      return { ...state, globalLoading: state.globalLoading - 1 }
    default:
      return state
  }
}