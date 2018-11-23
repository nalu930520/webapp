import React, { PropTypes } from 'react';
import s from './index.less';
import defaultAvatar from '../../../public/default_avatar.png';
class CantactCard extends React.Component {
  render() {
    const { contactAvatar, contactName, contactMobile } = this.props;
    return (
      <div className={s.contactWrpaer}>
        <img src={contactAvatar || defaultAvatar} alt="" />
        <div className={s.contactInfo}>
          <div className={s.contactName}>{contactName || 'Mobi User'}</div>
          <div className={s.contactMobile}>{contactMobile}</div>
        </div>
      </div>
    );
  }
}
export default CantactCard;
