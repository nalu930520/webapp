import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import QRCode from 'qrcode.react';
import { message } from 'antd'
import { FormattedMessage } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import s from './index.less'

const ReceiveQR = ({ qrcodeString, address, i18n, tag, currencyCode }) => {
  return (
    <div className={s.ReceiveQRWraper}>
      <div className={s.qrcodeWraper}>
        <QRCode value={qrcodeString} size={170} level={'M'} />
      </div>
      <div className="copyWrape">
        <h1 className={s.tagTitle} >Address</h1>
        <input
          className={s.adressInput}
          id="adressInput"
          value={address}
        />
        <CopyToClipboard
          text={address}
        >
          <span className="adressButton" onClick={() => {
            setTimeout(() => {
              message.success(i18n.messages.receive_text_copy_success);
            }, 500)
          }}>
            <FormattedMessage id="receive_button_copy" />
          </span>
        </CopyToClipboard>
        { tag ? (
          <div>
            <h1 className={s.tagTitle} >{currencyCode === 'xrp' ? 'Tag' : 'Memo'}</h1>
            <input
              className={s.adressInput}
              id="tagInput"
              value={tag}
            />
            <CopyToClipboard
              text={tag}
            >
              <span className="adressButton" onClick={() => {
                setTimeout(() => {
                  message.success(i18n.messages.receive_text_copy_success);
                }, 500)
              }}>
                <FormattedMessage id="receive_button_copy" />
              </span>
            </CopyToClipboard>
          </div>
        ) : '' }
      </div>
    </div>
  )
}

export default ReceiveQR
