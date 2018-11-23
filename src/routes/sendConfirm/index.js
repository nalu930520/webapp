import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Spin } from 'antd'
import s from './index.less'
import { IntlProvider, FormattedMessage }  from 'react-intl'
import store from 'store';
import Authorize from '../../../public/pic.png';
import QRCode from 'qrcode.react';
import { apiURL } from '../../utils/config.js'
import { routerRedux } from 'dva/router';
function SendConfirm ({ i18n, dispatch }) {
  return (
    <IntlProvider locale={i18n.locale} messages={i18n.messages}>
      <Row gutter={24}>
        <Col>
          <Card bordered={false} bodyStyle={{ padding: '150px 0' }}>
            <div className={s.confirmAuth}>
              <div className={s.sendAuthLeft}>
                <h3><FormattedMessage id="send_authorization_label_authorize_on_app" /></h3>
                <img src={Authorize} />
                <div className={s.sendAuthDes} style={{ color: '#999999' }}>
                  <FormattedMessage id="send_authorization_text_authorize_not_receive" />
                  <br />
                  <FormattedMessage id="send_authorization_text_authorize_resend" />
                  <br />
                  <FormattedMessage
                    id="send_authorization_text_authorize_cancel"
                    values={{
                      cancel: <a onClick={() => {
                        store.remove('SNcode');
                        dispatch(routerRedux.push('/sendreceive'))
                      }}>{i18n.messages.locale === 'zh' ? '取消' : 'cancel'}</a>
                    }}
                  />
                </div>
              </div>
              <div className={s.sendAuthCenter}>
              </div>
              <div className={s.sendAuthRight}>
                <h3><FormattedMessage id="send_authorization_label_qr" /></h3>
                  <div className={s.confirmQrcode}>
                    <QRCode
                      value={`${apiURL}/web/action?action=tradeconfirm&key=${store.get('SNcode')}`}
                      size={240}
                      level={'M'} />
                  </div>  
                <div className={s.sendAuthDes} style={{ color: '#999999' }}>
                  <FormattedMessage id="send_authorization_text_qr_description" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
        {/* <Loader spinning={ isLoading }/> */}
      </Row>
    </IntlProvider>
  )
}

export default connect(({ SendConfirm, i18n }) => ({ SendConfirm, i18n }))(SendConfirm)
