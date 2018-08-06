import React, { Component } from 'react'
import { connect } from 'react-redux'
import Transaction, { NAME as TransactionNAME } from './transaction'
import MoneyTransfer, { NAME as MoneyTransferNAME } from './moneyTransfer'
import BondTransfer, { NAME as BondTransferNAME } from './bondTransfer'
import IssueBond, { NAME as IssueBondNAME } from './issueBond'
import Subscription, { NAME as SubscriptionName } from './subscription'
import Deposit, { NAME as DepositName } from './moneyDeposit'
import Withdraw, { NAME as WithdrawName } from './moneyWithdraw'
import CreateBondWallet, { NAME as CreateBondWalletName } from './createBondWallet'
import BondBookClose, { NAME as BondBookCloseName } from './bondBookClose'
import BondBookCloseDetails, { NAME as BondBookCloseDetailsName } from './bondBookCloseDetails'
import CouponPayout, { NAME as CouponPayoutName } from './couponPayout'
import BondBuyback, { NAME as BondBuybackName } from './bondBack'

export const TRANSACTION_MODAL = TransactionNAME
export const MONEY_TRANSFET_MODAL = MoneyTransferNAME
export const BOND_TRANSFER_MODAL = BondTransferNAME
export const ISSUE_BOND_MODAL = IssueBondNAME
export const SUBSCRIPTION_MODAL = SubscriptionName
export const DEPOSIT_NAME = DepositName
export const WITHDRAW_NAME = WithdrawName
export const CREATE_BOND_WALLET_NAME = CreateBondWalletName
export const BOND_BOOK_CLOSE_NAME = BondBookCloseName
export const BOND_BOOK_CLOSE_DETAILS_MODAL = BondBookCloseDetailsName
export const COUPON_PAYOUY_MODAL = CouponPayoutName
export const BOND_BUYBACK_NAME = BondBuybackName

export default connect((state) => ({ modalOpenName: state.view.modalOpenName }))(class extends Component {
  render() {
    switch (this.props.modalOpenName) {
      case TRANSACTION_MODAL:
        return <Transaction />
      case MONEY_TRANSFET_MODAL:
        return <MoneyTransfer />
      case BOND_TRANSFER_MODAL:
        return <BondTransfer />
      case ISSUE_BOND_MODAL:
        return <IssueBond />
      case SUBSCRIPTION_MODAL:
        return <Subscription />
      case DEPOSIT_NAME:
        return <Deposit />
      case WITHDRAW_NAME:
        return <Withdraw />
      case CREATE_BOND_WALLET_NAME:
        return <CreateBondWallet />
      case BOND_BOOK_CLOSE_NAME:
        return <BondBookClose />
      case BOND_BOOK_CLOSE_DETAILS_MODAL:
        return <BondBookCloseDetails />
      case COUPON_PAYOUY_MODAL:
        return <CouponPayout />
      case BOND_BUYBACK_NAME:
        return <BondBuyback />
      default:
        return null
    }
  }
})