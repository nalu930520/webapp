import React, { PropTypes } from 'react';
import s from './index.less';
import totalImg from '../../../public/totalBalance.png';
import { Button, Row, Col, Menu, Icon } from 'antd';
import { codeTocurrencyCode, numberFormat, formatCurrency } from '../../utils';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import CountUp from 'react-countup';
import { injectIntl } from 'react-intl';
import { formatNumber } from '../../utils/index.js';
import _ from 'lodash';

const totalBalance = ({walletInfo, totalBalance, sendClick, receiveClick, intl}) => {
  return (
      <div className={s.totalBalanceWraper}>
        <Row type="flex" justify="space-between" align="top">
          <Col sm={16} xs={24}>
            <Col span={4}>
              <div className={walletInfo ? s.avatarWraper : ''}>
                <img className={s.leftImg} src={walletInfo ? walletInfo.countryimg : totalImg} />
              </div>
            </Col>
            <Col sm={18} xs={24}>
              <div className={s.totalTitle}>
                <FormattedMessage id="mywallets_label_total_balance"/>
              </div>
              <Row type="flex" justify="start" align="top">
                <Col>
                  {walletInfo
                    ? <div className={s.totalCount}>
                      {formatCurrency(walletInfo.balance, walletInfo.currencyCode)}
                    </div>
                    : <div className={s.totalCount}>
                        {totalBalance} {' '} bits
                      </div>}
                </Col>
                <Col>
                  <span className={s.currencyUnit}>
                    {walletInfo
                      ? codeTocurrencyCode(walletInfo.currencyCode)
                      : ''}
                  </span>
                </Col>
                <Col>
                  <span className={s.currencyUnit}>
                    {walletInfo
                      ? walletInfo.currencyCode !== 'btc'
                          ? <span>
                            ({numberFormat(walletInfo.equivalentBTC, 2, 2)}
                            {' '}
                              bits)
                            </span>
                          : ''
                      : ''}
                  </span>
                </Col>
              </Row>
            </Col>
          </Col>
          {!walletInfo ? (
            <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={sendClick}>
                <FormattedMessage id="general_button_send"/>
              </Button>
              &nbsp;&nbsp;
              <Button type="primary" onClick={receiveClick}>
                <FormattedMessage id="general_button_receive"/>
              </Button>
            </Col>
          ) : ''}
        </Row>
      </div>
    );
}

export default totalBalance;
