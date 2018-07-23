import _ from 'lodash'

import { LOGOUT_SUCCESS } from '../actions/account'
import { FETCH_MONEY_TRANSFER_EVENT_SUCCESS, FETCH_BOND_TRANSFER_EVENT_SUCCESS } from "../actions/events"

const initialState = { moneyTransfers: [], bondTransfers: [] }

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_MONEY_TRANSFER_EVENT_SUCCESS:
      return { ...state, moneyTransfers: _.uniqBy([...payload, ...state.moneyTransfers], 'eventId') }
    case FETCH_BOND_TRANSFER_EVENT_SUCCESS:
      return { ...state, bondTransfers: _.uniqBy([...payload, ...state.bondTransfers], 'eventId') }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
