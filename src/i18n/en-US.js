

import {default as index} from './en_US/index';

export default Object.assign({
  locale: 'en',
  pluralRuleFunction: () => {
    return 'other'
  }
}, index);
