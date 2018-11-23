import React from 'react'
import styles from './Footer.less'
import { config } from 'utils'
import {FormattedMessage} from 'react-intl';

const Footer = () => <div className={styles.footer}>
 <FormattedMessage id="general_footer_text_copyright"/>
</div>

export default Footer
