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
  GOOGLE_REGISTER_ATTEMPTED,
  WELCOME_EMAIL_FAILED,
  TWO_FACTOR_RESET_SUCCESS
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
  } else if (type == 'google') {
    dispatch({
      type: GOOGLE_REGISTER_ATTEMPTED,
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

export const twoFactorAuthCheckPasswordReset = (email, code) => async (dispatch) => {
  const body = { email, code };

  try {
    await axios.post('/api/twofa/verify', body);
    dispatch({
      type: TWO_FACTOR_RESET_SUCCESS,
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

export const attemptGoogle = () => (dispatch) => {
  dispatch({
    type: GOOGLE_REGISTER_ATTEMPTED,
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
    console.log('sending welcome email...');
    sendWelcomeEmail(email, name);
    return true;

    // dispatch(setAlert('Text message sent'));
  } catch (err) {
    dispatch({
      type: WELCOME_EMAIL_FAILED,
    });
    return false;
    // const errors = err.response.data.errors;
  }
};

export const uploadProfilePicture = (file, id) => async (dispatch) => {
  try {
    var result = await axios.get('/api/image');
    console.log(result.data);
    const response = await fetch(result.data, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
      'Cache-Control': 'no-store max-age=0',
      'Content-Type': file[0].type,
      'x-ms-date': new Date().toUTCString(),
      'x-ms-version': '2020-04-08',
      'x-ms-blob-type': 'BlockBlob'
      },
      body: file[0], // body data type must match "Content-Type" header
    });
    await axios.post('/api/image');
  } catch (error) {
    console.log(error);
  }
};

// Login User
export const findPhoneNumber = (email) => async (dispatch) => {
  var body = { email: email };

  try {
    const res = await axios.post('/api/auth/phone', body);
    // const res = await axios.post('/api/auth', body);
    dispatch(twoFactorAuth(email, res.data));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Login User
export const changePassword = (email, newPassword) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  var body = { email, newPassword };

  try {
    await axios.post('/api/auth/newpassword', body);
    // const res = await axios.post('/api/auth', body);
    dispatch(setAlert('Your password has been changed'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Get user info into csv string
export const getUsersCSVString = () => async (dispatch) => {
  try {
    var csvString = await axios.get('/api/csv');
    return csvString.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Get profile info into csv string
export const getProfileCSVString = () => async (dispatch) => {
  try {
    var csvString = await axios.get('/api/csv/profiles');
    return csvString.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Get combined info into csv string
export const getCombinedCSVString = () => async (dispatch) => {
  try {
    var csvString = await axios.get('/api/csv/combined');
    return csvString.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Send combined info into csv string
export const uploadCsv = (csvData) => async (dispatch) => {
  var body = csvData;
  try {
    if (
      window.confirm (
        'Are you sure you want to add these users to the database? It will permenantly alter user data.'
      )
    ) {
      var csvString = await axios.post('/api/csv/upload', body);
      return csvString.data;
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// make stripe payment request
export const stripePayment = (paymentMethod) => async (dispatch) => {
  const body = { paymentMethod };
  try {
    var result = await axios.post('/api/stripe', body);
    dispatch(setAlert('Payment recieved'));
    var secret = result.data.clientSecret;
    return secret;
  } catch (err) {
    console.log(err);
  }
};
