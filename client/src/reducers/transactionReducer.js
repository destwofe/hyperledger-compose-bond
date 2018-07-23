import { LOGOUT_SUCCESS } from '../actions/account'
import { FETCH_TRANSACTION_SUCCESS } from "../actions/transaction"

const initialState = []

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_TRANSACTION_SUCCESS:
      return [...payload]
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
