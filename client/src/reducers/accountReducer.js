import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/account'
import { AUTHORIZE_FAIL } from '../actions'
import Axios from 'axios';
import { getSafe } from '../utils';

const initialState = { accessToken: null, accountData: null }

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload }
    case LOGOUT_SUCCESS:
    case AUTHORIZE_FAIL:
      Axios.defaults.headers = { accessToken: null }
      return initialState
    case 'persist/REHYDRATE':
      Axios.defaults.headers = { accessToken: getSafe(() => action.payload.account.accessToken) }
      return state
    default:
      return state
  }
}
