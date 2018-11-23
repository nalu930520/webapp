import React from 'react';
import s from './index.less';
import Dialog from 'rc-dialog';
import { codeTocurrencyCode, getcurrencyBycode, formatNumber, formatCurrency }  from '../../utils';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import DetailAmount from '../detailAmount';
import moment from 'moment';
import _ from 'lodash';
function TransactionModal ({ record, onclose, currentCode, loading }) {
  const cryptoExproler = {
    btc: 'https://blockchain.info/tx/',
    ltc: 'https://live.blockcypher.com/ltc/tx/',
    bcc: 'https://blockdozer.com/insight/tx/',
    btg: 'https://explorer.bitcoingold.org/insight/tx/',
    dash: 'https://insight.dash.org/insight/tx/',
    zec: 'https://explorer.zcha.in/transactions/',
    usdt: 'https://omniexplorer.info/tx/',
    xrp: 'https://xrpcharts.ripple.com/#/transactions/',
    xmr: 'https://moneroblocks.info/tx/',
    eos: 'https://eosmonitor.io/txn/',
    bcd: 'http://explorer.btcd.io/#/TX?TX=',
  }
  const isBtc = (currencyCode) => {
    return currencyCode === 'btc' ? 100 : Math.pow(10, 8);
  }
  const  getTypeName = (record) => {
    let typeName;
    switch (record.type) {
      case 3:
        typeName = <FormattedMessage id='transaction_type_text_3' />
        break;
      case 4:
        typeName = <FormattedMessage id='transaction_type_text_4' />
        break;
      case 5:
        typeName = <FormattedMessage id='transaction_type_text_5' />
        break;
      case 6:
        typeName =  record.isPayer !== 1 ? <FormattedMessage id='transaction_type_text_6' />
        : <FormattedMessage id='transaction_type_text_7' />
        break;
      case 7:
        typeName = <FormattedMessage id='transaction_type_text_6' />
        break;
      case 11:
        typeName = <FormattedMessage id='transaction_type_text_11' />
        break;
      case 12:
        typeName = <FormattedMessage id='transaction_type_text_12' />
        break;
      case 13:
        typeName = <FormattedMessage id='transaction_type_text_13' />
        break;
      case 14:
        typeName = <FormattedMessage id='transaction_type_text_14' />
        break;
      case 15:
        typeName = <FormattedMessage id='transaction_type_text_15' />
        break;
      case 16:
        typeName = <FormattedMessage id='transaction_type_text_16' />
        break;
      case 17:
        typeName = <FormattedMessage id='transaction_type_text_17' />
        break;
      case 18:
        typeName = <FormattedMessage id='transaction_type_text_18' />
        break;
      default:
        typeName = ''
        break;
    }
    return typeName;
  }
  const getStateTag = (record) => {
    let recordStatus;
    switch (record.status) {
      case 4:
        recordStatus = <FormattedMessage id="transaction_label_completed" />;
        break;
      default:
        recordStatus = <FormattedMessage id="transaction_label_pending" />;
    }
    return recordStatus;
  }
  const getOrderUserName = (record) => {
    if (!record.userInfo) {
      const someone = record.someone
      return someone.split('-')[1];
    }
    const userInfo = record.userInfo[0];
    return userInfo.friend_alias || userInfo.mobi_name || userInfo.mobile;
  }
  const getBalance = (record) => {
    if (record.balance === -1) {
      return <FormattedMessage id="transaction_label_pending" />
    }
    return formatCurrency(
      record.currencyCode !== currentCode ? record.targetBalance : record.balance,
      currentCode
    )
  }
  const getTransactionHref = (record) => {

    switch (currentCode) {
      case 'btc':
        return `http://blockchain.info/tx/${record.txnId}`
      case 'eth':
        return `https://etherscan.io/tx/${record.txnId}`
      case 'ltc':
        return `https://live.blockcypher.com/ltc/tx/${record.txnId}`
      case 'bcc':
        return `http://bcc.blockdozer.com/insight/tx/${record.txnId}`
      default:
        return ''
    }
  }
  const getRateNumber = (currencyCode, feeCurrency, amount, targetAmount) => {
    const getCurrencyNumber = (amount, currencyCode) =>
      amount / Math.pow(10, getcurrencyBycode(currencyCode).decimal_place);
    const getBaseCurrency = currencyCode =>
      Math.pow(10, getcurrencyBycode(currencyCode).first_currency_rate_place)
    const calculateResult =
      getCurrencyNumber(targetAmount, feeCurrency) /
      getCurrencyNumber(amount, currencyCode) *
      getBaseCurrency(currencyCode);
    return (
      <span>
        <FormattedNumber
          value={getBaseCurrency(currencyCode)}
          minimumFractionDigits={
            getcurrencyBycode(currencyCode).client_display_decimal_place
          }
          maximumFractionDigits={
            getcurrencyBycode(currencyCode).client_display_decimal_place
          }
        />
        {' '}
        {codeTocurrencyCode(currencyCode)}
        {' '}
        ≈
        {' '}
        <FormattedNumber
          value={calculateResult}
          minimumFractionDigits={
            getcurrencyBycode(feeCurrency).client_display_decimal_place
          }
          maximumFractionDigits={
            getcurrencyBycode(feeCurrency).client_display_decimal_place
          }
        />
        {' '}
        {codeTocurrencyCode(feeCurrency)}
      </span>
    );
  }
  return (
    <Dialog
      visible={true}
      onClose={onclose}
    >
      <div className={s.dialogHeader}>
        <FormattedMessage id="transaction_label_detail" />
      </div>
      <div className={s.detailAmount}>
        <DetailAmount record={record} />
        <table className={s.detailTable}>
          <tbody>
            <tr>
              <td><FormattedMessage id="transaction_label_type" /></td>
              <td>{getTypeName(record)}</td>
            </tr>
            {record.type === 11 || record.type === 12
                ? <tr>
                  <td><FormattedMessage id="transaction_label_rate" /></td>
                  <td>
                    {getRateNumber(
                        record.currencyCode,
                        record.feeCurrency,
                        record.amount,
                        record.targetAmount,
                      )}
                    <br />
                    {getRateNumber(
                        record.feeCurrency,
                        record.currencyCode,
                        record.targetAmount,
                        record.amount,
                      )}
                  </td>
                </tr>
                : ''}
            {record.type === 6 || record.type === 5
                ? <tr>
                  <td>
                    {record.isPayer
                        ? <FormattedMessage id="transaction_label_recipient" />
                        : <FormattedMessage id="transaction_label_sender" />}
                    </td>
                  <td>
                    {record.type === 5
                        ? getOrderUserName(record)
                        : record.isPayer === 1 ? `${record.payeeName.substring(0, 10)}...${record.payeeName.substring(record.payeeName.length - 10)}`:
                        <FormattedMessage id="receive_label_bitcoin_address" />
                    }
                    {record.type === 6
                        ? <span
                          className="statusTag"
                          style={{ float: 'right' }}
                        >
                          <FormattedMessage id="transaction_label_onchain" />
                        </span>
                        : ''}
                  </td>
                </tr>
                : ''}
            <tr>
              <td><FormattedMessage id="transaction_label_time" /> </td>
              <td>
                {moment(record.createdAt).format()}
              </td>
            </tr>
            <tr>
              <td><FormattedMessage id="transaction_label_balance" /></td>
              <td>
                {getBalance(record)}{' '}{ record.balance !== -1 ? codeTocurrencyCode(currentCode) : ''}
              </td>
            </tr>
            <tr>
              <td><FormattedMessage id="transaction_label_id" /></td>
              <td>
                {record.txnId
                    ? <a href={`${cryptoExproler[record.currencyCode]}${record.txnId}`}>{`${record.txnId.substring(0, 10)}...${record.txnId.substring(record.txnId.length - 10)}`}</a>
                    : record.SN}
                {record.type === 6
                    ? <span
                      className="statusTag"
                      style={{
                        backgroundColor: record.status !== 4
                            ? '#F6A821'
                            : '#5cb85c',
                      }}
                    >
                      {getStateTag(record)}
                    </span>
                    : ''}
              </td>
            </tr>
            {record.description !== ''
                ? <tr>
                  <td><FormattedMessage id="transaction_label_message" /></td>
                  <td>{record.description}</td>
                </tr>
                : ''}
            <tr>
              <td><FormattedMessage id="transaction_label_note" /></td><td />
            </tr>
          </tbody>
        </table>
      </div>
    </Dialog>
  )
}

export default TransactionModal;