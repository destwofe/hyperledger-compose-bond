import Axios from 'axios'
import { BASE_URL } from '.'
import { fetchBond, fetchBondSubscriptionContract, fetchMoneyWallet, fetchBondWallet } from './asset';
import { fetchMoneyTransferEvents, fetchBondTransferEvents } from './events'

export const FETCH_TRANSACTION_SUCCESS = 'FETCH_TRANSACTION_SUCCESS'
export const fetchTransaction = (transactions) => (dispatch, getState) => {
  const URI = (transactions && transactions.length) > 0
    ? `${BASE_URL}/api/historians?transactionIDs=${JSON.stringify(transactions)}`
    : `${BASE_URL}/api/historians`
  return Axios.get(URI)
    .then(response => {
      dispatch({
        type: FETCH_TRANSACTION_SUCCESS,
        payload: response.data
      })
    })
}

export const submitSubscriptionTransaction = ({ subscriptionContract, moneyWallet, bondWallet, amount }) => (dispatch, getState) => Axios.post(`${BASE_URL}/api/transaction/bondsubscription`, { subscriptionContract, moneyWallet, bondWallet, amount })
  .then(() => Promise.all([fetchBondSubscriptionContract(getState().asset.subscriptionContract.find(a => a.id === subscriptionContract).id)(dispatch)]))

export const submitSubscriptionCloseSaleTransaction = ({ subscriptionContract }) => (dispatch, getState) => Axios.post(`${BASE_URL}/api/transaction/bondsubscriptionclosesale`, {subscriptionContract})
  .then(() => Promise.all([fetchBondSubscriptionContract(getState().asset.subscriptionContract.find(a => a.id === subscriptionContract).id)(dispatch)]))

export const submitCouponPayoutTransaction = ({bond, moneyWallet}) => (dispatch) => Axios.post(`${BASE_URL}/api/transaction/couponpayout`, {bond, moneyWallet})
  .then(() => Promise.all([fetchBond()(dispatch), fetchMoneyWallet()(dispatch), fetchTransaction()(dispatch)]))
  
export const submitBondBuybackTransaction = ({bond, moneyWallet}) => (dispatch) => Axios.post(`${BASE_URL}/api/transaction/buyback`, {bond, moneyWallet})
  .then(() => Promise.all([fetchBond()(dispatch), fetchMoneyWallet()(dispatch), fetchTransaction()(dispatch)]))

export const bondTransferTransaction = ({ from, to, amount }) => (dispatch) => Axios.post(`${BASE_URL}/api/transaction/bondtransfer`, { from, to, amount })
  .then(() => Promise.all([fetchBondWallet()(dispatch), fetchBondTransferEvents(from)(dispatch)]))

export const moneyTransferTransaction = ({ from, to, amount }) => (dispatch) => Axios.post(`${BASE_URL}/api/transaction/moneytransfer`, { from, to, amount })
  .then(() => Promise.all([fetchMoneyWallet()(dispatch), fetchMoneyTransferEvents(from)(dispatch)]))

export const moneyDepositTransaction = ({ to, amount }) => dispatch => Axios.post(`${BASE_URL}/api/transaction/moneydeposit`, { to, amount })
  .then(() => Promise.all([fetchMoneyWallet()(dispatch), fetchMoneyTransferEvents(to)(dispatch)]))

export const moneyWithdrawTransaction = ({ from, amount }) => dispatch => Axios.post(`${BASE_URL}/api/transaction/moneywithdraw`, { from, amount })
  .then(() => Promise.all([fetchMoneyWallet()(dispatch), fetchMoneyTransferEvents(from)(dispatch)]))

export const issueBond = ({ symbol, parValue, couponRate, paymentFrequency, issueTerm, issuerMoneyWallet, hardCap }) => dispatch => Axios.post(`${BASE_URL}/api/issueBond`, { symbol, parValue, couponRate, paymentFrequency, issueTerm, issuerMoneyWallet, hardCap })
  .then(() => Promise.all([fetchBond()(dispatch)]))