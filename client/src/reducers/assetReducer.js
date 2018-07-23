import _ from 'lodash'
import { LOGOUT_SUCCESS } from '../actions/account'
import { FETCH_BOND_SUCCESS, FETCH_BOND_SUBSCRIPTION_CONTRACT_SUCCESS, FETCH_BOND_WALLET_SUCCESS, FETCH_MONEY_WALLET_SUCCESS } from '../actions/asset'

const initialState = { bonds: [], bondWallets: [], moneyWallets: [], subscriptionContract: [] }

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_BOND_SUCCESS:
      return { ...state, bonds: payload }
    case FETCH_BOND_SUBSCRIPTION_CONTRACT_SUCCESS:
      return { ...state, subscriptionContract: _.uniqBy([...payload, ...state.subscriptionContract], 'id') }
    case FETCH_BOND_WALLET_SUCCESS:
      return { ...state, bondWallets: _.unionBy([...payload, ...state.bondWallets], 'id') }
    case FETCH_MONEY_WALLET_SUCCESS:
      return { ...state, moneyWallets: payload }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
