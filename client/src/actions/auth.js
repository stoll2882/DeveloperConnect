import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  RECAPTCHA_APPROVED,
  RECAPTCHA_DENIED,
  FACEBOOK_REGISTER_ATTEMPTED,
  RECAPTCHA_EXPIRED,
  CONTACT_MESSAGE_SENT,
  TWO_FACTOR_ATTEMPTED,
  TWO_FACTOR_SUCCESS,
  TWO_FACTOR_FAILED,
  WELCOME_EMAIL_SENT,
} from './types';
import setAuthToken from '../utils/setAuthToken';
import { Fragment } from 'react';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const attemptFacebook = () => (dispatch) => {
  dispatch({
    type: FACEBOOK_REGISTER_ATTEMPTED,
  });
};

// Register User
export const register = (
  name,
  email,
  password,
  phoneNumber,
  type,
  id
) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (type == 'facebook') {
    dispatch({
      type: FACEBOOK_REGISTER_ATTEMPTED,
    });
  }
  var body;
  if (!password) {
    password = id;
    body = JSON.stringify({ name, email, password, phoneNumber, type, id });
  } else {
    body = JSON.stringify({ name, email, password, phoneNumber, type });
  }

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Check if user is human
export const reCaptchaCheck = (value) => async (dispatch) => {
  const body = { value: value };

  try {
    await axios.post('/api/recaptcha', body);

    dispatch({
      type: RECAPTCHA_APPROVED,
    });
  } catch (err) {
    dispatch({
      type: RECAPTCHA_DENIED,
    });
  }
};

export const dispatchExpireCaptcha = () => (dispatch) => {
  dispatch({
    type: RECAPTCHA_EXPIRED,
  });
};

// Login User
export const login = (email, password, id) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  var body;
  if (!id) {
    body = JSON.stringify({ email, password });
  } else {
    password = id;
    body = JSON.stringify({ email, password });
  }

  try {
    const res = await axios.post('/api/auth', body, config);
    // const res = await axios.post('/api/auth', body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const sendTextMessage = (name, phoneNumber, message) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  var body;
  body = JSON.stringify({ name, phoneNumber, message });

  try {
    await axios.post('/api/textmessage', body, config);
    dispatch({
      type: CONTACT_MESSAGE_SENT,
    });

    // dispatch(setAlert('Text message sent'));
  } catch (err) {
    const errors = err.response.data.errors;
  }
};

export const twoFactorAuth = (email, phoneNumber) => async (dispatch) => {
  const body = { email: email, phoneNumber: phoneNumber };

  dispatch({
    type: TWO_FACTOR_ATTEMPTED,
  });
  try {
    await axios.post('/api/twofa', body);
    dispatch({
      type: CONTACT_MESSAGE_SENT,
    });

    // dispatch(setAlert('Text message sent'));
  } catch (err) {
    const errors = err.response.data.errors;
  }
};

export const twoFactorAuthCheck = (email, code) => async (dispatch) => {
  const body = { email, code };

  try {
    await axios.post('/api/twofa/verify', body);
    dispatch({
      type: TWO_FACTOR_SUCCESS,
    });
    return true;

    // dispatch(setAlert('Text message sent'));
  } catch (err) {
    dispatch({
      type: TWO_FACTOR_FAILED,
    });
    return false;
    // const errors = err.response.data.errors;
  }
};

export const dispatchTwoFactorAuth = (code) => async (dispatch) => {
  // const body = { code: code };
  dispatch({
    type: TWO_FACTOR_ATTEMPTED,
  });
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

export const sendWelcomeEmail = (email, name) => async (dispatch) => {
  const body = { email, name };
  try {
    await axios.post('/api/email/welcome', body);
    dispatch({
      type: WELCOME_EMAIL_SENT,
    });
    return true;

    // dispatch(setAlert('Text message sent'));
  } catch (err) {
    dispatch({
      type: TWO_FACTOR_FAILED,
    });
    return false;
    // const errors = err.response.data.errors;
  }
};
