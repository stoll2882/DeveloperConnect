import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  RECAPTCHA_APPROVED,
  RECAPTCHA_EXPIRED,
  RECAPTCHA_DENIED,
  FACEBOOK_REGISTER_ATTEMPTED,
  TWO_FACTOR_ATTEMPTED,
  TWO_FACTOR_SUCCESS,
  TWO_FACTOR_FAILED,
  GOOGLE_REGISTER_ATTEMPTED,
  TWO_FACTOR_RESET_SUCCESS,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  recaptchaApproved: false,
  facebookAttempted: false,
  googleAttempted: false,
  twoFactorAttempted: false,
  twoFactorApproved: false,
  twoFactorResetApproved: false,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        facebookAttempted: false,
        googleAttempted: false,
        // twoFactorAttempted: false,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        facebookAttempted: false,
        googleAttempted: false,
        twoFactorAttempted: false,
      };
    case TWO_FACTOR_FAILED:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        facebookAttempted: false,
        googleAttempted: false,
        twoFactorApproved: false,
        // twoFactorAttempted: false,
        // twoFactorAttempted: false,
      };
    case RECAPTCHA_EXPIRED:
    case RECAPTCHA_DENIED:
      return {
        ...state,
        recaptchaApproved: false,
      };
    case RECAPTCHA_APPROVED:
      return {
        ...state,
        recaptchaApproved: true,
      };
    case TWO_FACTOR_ATTEMPTED:
      return {
        ...state,
        twoFactorAttempted: true,
      };
    case FACEBOOK_REGISTER_ATTEMPTED:
      return {
        ...state,
        facebookAttempted: true,
      };
    case GOOGLE_REGISTER_ATTEMPTED:
      return {
        ...state,
        googleAttempted: true,
      };
    case TWO_FACTOR_SUCCESS:
      return {
        ...state,
        twoFactorApproved: true,
      };
    case TWO_FACTOR_FAILED:
      return {
        ...state,
        twoFactorApproved: false,
      };
    case TWO_FACTOR_RESET_SUCCESS:
      return {
        ...state,
        twoFactorApproved: true,
      }
    default:
      return state;
  }
}
