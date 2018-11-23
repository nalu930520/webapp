import * as i18n from '../i18n';
import Cookies from 'universal-cookie'
const cookies = new Cookies();

export default {
  namespace: 'i18n',
  state: {
    locale: 'zh',
    messages: null,
    formats: null
  },
  reducers: {
    setLocale(state, {locale}) {
      localStorage.setItem('locale', locale);
      cookies.set('lang', locale, { domain: '.mobi.me' })
      cookies.set('lang', locale, { domain: '.mobiapp.cn' })
      if (window.KF5SupportBoxAPI) {
        window.KF5SupportBoxAPI.useLang(locale.indexOf('zh') > -1 ? 'zh_CN' : 'en')
      }
      return Object.assign({}, state, {
        locale: locale,
        messages: i18n[locale]
      });
    }
  },
  effects: {},
  subscriptions: {
    set({dispatch, history}) {
      return history.listen(() => {
          let lang = localStorage.getItem('locale');
          const type = navigator.appName;
          if (!lang) {
            if (type === 'Netscape') {
              lang = navigator.language
            } else {
              lang = navigator.userLanguage
            }
          }
          if (window.KF5SupportBoxAPI) {
            window.KF5SupportBoxAPI.useLang(lang.indexOf('zh') > -1 ? 'zh_CN' : 'en')
          }
          dispatch({type: 'setLocale', locale: lang.indexOf('zh') > -1 ? 'zh' : 'en'});
          localStorage.setItem('locale', lang.indexOf('zh') > -1 ? 'zh' : 'en');
        }
      )
    }
  }
};
