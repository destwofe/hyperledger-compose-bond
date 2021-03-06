import { combineReducers } from 'redux'

import ViewReducer from './viewReducer'
import AccountReducer from './accountReducer'
import AssetReducer from './assetReducer'
import TransactionReducer from './transactionReducer'
import EventReducer from './eventReducer'
import LoadingReducer from './loadingReducer'

export default combineReducers({
  view: ViewReducer,
  account: AccountReducer,
  asset: AssetReducer,
  transactions: TransactionReducer,
  event: EventReducer,
  loading: LoadingReducer
})
