import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Spin, Button } from 'antd'
import s from './index.less'
import { IntlProvider, FormattedMessage }  from 'react-intl'
import store from 'store';
import sendSuccessIcon from '../../../public/icon_send_success.png';
import QRCode from 'qrcode.react';
import { apiURL } from '../../utils/config.js'
import { routerRedux } from 'dva/router';
import { getcurrencyBycode, codeTocurrencyCode, formatNumber, numberFormat } from '../../utils'
import TransactionModal from '../../components/transactionModal';
import _ from 'lodash'

class SendSuccess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowDialog: false,
    }
  }
  render () {
    const { i18n, sendSuccess, dispatch } = this.props
    const { transactionDetail } = sendSuccess
    return (
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        <Row gutter={24}>
          <Col>
            <Card bordered={false} bodyStyle={{ padding: '150px 0' }}>
              <div className={s.sendAuth}>
                <h3><FormattedMessage id="send_success_label_congratulation" /></h3>
                <img src={sendSuccessIcon} />
                <p style={{ color: '#333', marginTop: 43, fontSize: '20px', marginBottom: 10 }}>
                  <FormattedMessage 
                  id="send_success_text_summary"
                  values={{
                    amount: `${numberFormat(transactionDetail.amount, getcurrencyBycode(transactionDetail.currencyCode).decimal_place, getcurrencyBycode(transactionDetail.currencyCode).client_display_decimal_place)}`,
                    name: `${transactionDetail.payeeMobiName || transactionDetail.payeeName}`
                  }} />
                </p>
                <p>
                  <Button type="primary" size={'large'} style={{width: 180}} onClick={() => {
                    store.remove('SNcode');
                    dispatch(routerRedux.push('/sendreceive'))
                  }}><FormattedMessage id="send_success_button_send" /></Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="primary" size={'large'} onClick={() => this.setState({isShowDialog: true})} style={{width: 180}}><FormattedMessage id="send_success_button_detail" /></Button>
                </p>
              </div>
            </Card>
          </Col>
          {/* <Loader spinning={ isLoading }/> */}
          {this.state.isShowDialog ? (
              <TransactionModal
                record={transactionDetail}
                currentCode={transactionDetail.currencyCode}
                onclose={() => {
                  this.setState({
                    isShowDialog: false,
                  })
                }}
              />
            ): ''}
        </Row>
      </IntlProvider>
    )
  }
}

export default connect(({ sendSuccess, i18n }) => ({ sendSuccess, i18n }))(SendSuccess)
