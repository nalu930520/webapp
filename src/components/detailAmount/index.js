import React, { PropTypes } from 'react';
import s from './index.less';
import Row from '../../../node_modules/antd/lib/row/index';
import Col from '../../../node_modules/antd/lib/col/index'
import { defineMessages, FormattedMessage } from 'react-intl';
import amountArrow from '../../../public/convert-icon@2x.png';
import { codeTocurrencyCode, getcurrencyBycode, formatNumber, formatCurrency } from '../../utils';
import _ from 'lodash';

function isBtc(currencyCode) {
  return currencyCode === 'btc' ? 100 : Math.pow(10, 8);
}

class DetailAmount extends React.Component {
  render() {
    const { record } = this.props;
    return (
      <div className={s.detailAmount}>
        {record.type === 11 || record.type === 12
          ? <Row type="flex" justify="center" align="middle">
            <Col>
              <div className={s.amountwarper}>
                <img
                  src={getcurrencyBycode(record.currencyCode).image_url}
                  alt=""
                />
                <span className={s.amountNumberOne}>
                    -
                    {formatCurrency(record.amount, record.currencyCode)}
                  {' '}
                  {codeTocurrencyCode(record.currencyCode)}
                </span>
              </div>
            </Col>
            <Col>
              <img className={s.arrowStyle} src={amountArrow} alt="" />
            </Col>
            <Col>
              <div className={s.amountwarper}>
                <img
                  src={getcurrencyBycode(record.feeCurrency).image_url}
                  alt=""
                />
                <span className={s.amountNumberOne}>
                  {formatCurrency(record.targetAmount, record.feeCurrency)}
                  {' '}
                  {codeTocurrencyCode(record.feeCurrency)}
                </span>
              </div>
            </Col>
          </Row>
          : <Row type="flex" justify="space-between" align="middle">
            <div className={s.amountwarper} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <img
                src={getcurrencyBycode(record.currencyCode).image_url}
                alt=""
              />
              <span className={s.amountNumberTwo}>
                {record.isPayer ? '-' : '+'}
                {' '}
                {formatCurrency(
                  record.type === 6 ? (record.isPayer ? record.amount + record.fee + record.extraFee : record.amount): record.amount,
                  record.currencyCode
                 )}
                {' '}
                {codeTocurrencyCode(record.currencyCode)}
              </span>
            </div>
            <div className="statusTag">
              {record.isPayer
                  ? <FormattedMessage id="transaction_label_sent" />
                  : <FormattedMessage id="transaction_label_received" />}
            </div>
          </Row>}
        {record.type === 6 && record.isPayer === 1
          ? <ul className={s.feeWraper}>
            <li>
              <FormattedMessage id="transaction_label_network_fee" />
              <span className={s.feeAmountNum}>
                  {record.isPayer ? '-' : '+'}
                  {formatCurrency(
                    record.fee + record.extraFee,
                    record.currencyCode
                  )}
                  {' '}
                  {codeTocurrencyCode(record.currencyCode)}
                </span>
            </li>
            <li>
              <FormattedMessage id="transaction_label_sent_amount" />
              <span className={s.feeAmountNum}>
                {record.isPayer ? '- ' : '+ '}
                {formatCurrency(
                  record.amount,
                  record.currencyCode
                )}
                {' '}
                {codeTocurrencyCode(record.currencyCode)}
                </span>
              {' '}
            </li>
          </ul>
          : ''}
      </div>
    );
  }
}

export default DetailAmount
