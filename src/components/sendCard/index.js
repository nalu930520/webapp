import React, { PropTypes } from 'react';
import s from './index.less';
import selectedArrow from '../../../public/selectArrow.png';
class sendCard extends React.Component {
  render() {
    const { cardIcon, cardDes, selected } = this.props;
    return (
      <div className={s.cardWraper}>
        <img className={s.cardIcon} src={cardIcon} alt="" />
        <div className={s.cardDes}>{cardDes}</div>
      </div>
    );
  }
}
export default sendCard;
