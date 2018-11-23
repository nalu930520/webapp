import React, { PropTypes } from 'react';
import s from './QRScan.less';
import loadingimg from '../../../public/loading_spinner.gif';
import { Alert } from 'antd';
import QRcode from 'qrcode.react';
import { getMobileCodeByCountryCode } from '../../utils'
import refreshImg from '../../../public/icon-login-refresh.png';
import defaultAvatar from '../../../public/default_avatar.png';
import { iosDownloadUrl, androidDownloadUrl } from '../../utils/config'
import { FormattedMessage } from 'react-intl'
import store from 'store';
const QRScan = ({ errorState, userInfo, qrcodeUrl, refershQrcode, showRefresh }) => {
  const { avatar, mobile } = userInfo;
  return (
    <div className={s.qrscanContainer}>
      {errorState
        ? <Alert
          className="warnAlter"
          message="server unreachable,please try again later"
          type="error"
        />
        : ''}
      {mobile
        ? <div className="avatar">
          <img
            alt="user avatar"
            className="circle-warper"
            src={userInfo.avatar || defaultAvatar}
          />
          <div className={s.userInfo}>
            <span className={s.nickname}>{userInfo.nickname}</span>
            <span className={s.mobile}>{`+${getMobileCodeByCountryCode(userInfo.country_code)} ${userInfo.mobile}`}</span>
          </div>
          <h1 className="lead">
            <FormattedMessage id="login_qr_label_scan_success"/>
          </h1>
          <h2 className="lead2">
            <FormattedMessage id="login_qr_label_scan_confirm"/>
          </h2>
        </div>
        : <div className="qr">
          {!qrcodeUrl
            ? 
            (<img src={loadingimg} />):
            (<div className={s.qrcodeWraper}>              
              <QRcode value={qrcodeUrl} size={270} level={'M'} />
              <div className={s.mark} style={{ display: showRefresh ? 'flex' : 'none' }}>
                <div className={s.refreshImgwraper} onClick={() => {refershQrcode()}}><img src={refreshImg} alt=""/></div>
              </div>
             </div>)
          }
          {showRefresh ? (
            <h2 style={{ color: '#FB4545' }}><FormattedMessage id="login_qr_error_expired" /></h2>
          ) : (
            <h2><FormattedMessage id="login_qr_label_scan"/></h2>
          )}
        </div>}
      {avatar
        ? <div className={s.helperText}>
          <a href="/login">
            <FormattedMessage id="login_qr_link_switch"/>
          </a>
        </div>
        : <div className={s.helperText}>
          <FormattedMessage id="login_qr_label_no_account"/>
          <br />
          <FormattedMessage
            id="login_qr_label_download"
            values={{
              ios: <a href={iosDownloadUrl}> {store.get('locale') === 'zh' ? '苹果' : 'iOS'} </a>,
              android: <a href={androidDownloadUrl}> {store.get('locale') === 'zh' ? '安卓' : 'Android' } </a>,
            }}
          />
          {store.get('locale') === 'zh' ? (
          <div>中国苹果商店可下载 <a href="https://itunes.apple.com/cn/app/mobi%E7%99%BB%E5%BD%95%E5%99%A8/id1250823442?l=zh&ls=1&mt=8">Mobi 登录器</a></div>
          ): ''}
        </div>}
    </div>
  )
}

export default QRScan;
