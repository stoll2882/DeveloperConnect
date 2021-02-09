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

// Register User
export const register = (name, email, password, type, id) => async (
  dispatch
) => {
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
    body = JSON.stringify({ name, email, password, type, id });
  } else {
    body = JSON.stringify({ name, email, password, type });
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

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
