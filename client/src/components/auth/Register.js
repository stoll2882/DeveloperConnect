import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { reCaptchaCheck } from '../../actions/auth';

import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GmailLogin';
import ReCAPTCHA from 'react-google-recaptcha';

import PropTypes from 'prop-types';
import { check } from 'express-validator';

const Register = ({ setAlert, register, reCaptchaCheck, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    facebookLogin: false,
    human: false,
    humanKey: '',
  });
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const {
    name,
    email,
    password,
    password2,
    facebookLogin,
    human,
    humanKey,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else if (!privacyPolicyAccepted) {
      setAlert('Please accept the terms and conditions', 'danger');
    } else if (!humanKey || !human) {
      setAlert('Please verify you are human', 'danger');
    } else {
      register(name, email, password);
    }
  };

  const verifyCaptcha = (e) => {
    reCaptchaCheck(e.value);
  };

  const expireCaptcha = () => {
    setFormData({ ...formData, [human]: false, humanKey: null });
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      {!isAuthenticated ? (
        <Fragment>
          <h1 className="large text-primary">Sign Up</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Create Your Account
          </p>
          <FacebookLogin isChecked={privacyPolicyAccepted} />
          <GoogleLogin />
          <form className="form" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
              <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="6"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                minLength="6"
                value={password2}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <ReCAPTCHA
              sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
              onChange={verifyCaptcha}
              onExpired={expireCaptcha}
            />
            <br></br>
            <input
              type="checkbox"
              id="privacypolicy"
              name="privacypolicy"
              value="privacypolicy"
              onChange={(e) => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
            />{' '}
            <label for="privacypolicy">
              I agree to the{' '}
              <Link to="/privacypolicy">
                privacy policy and terms of service
              </Link>
            </label>
            <br></br>
            <br></br>
            <input type="submit" className="btn btn-primary" value="Register" />
          </form>
          <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </Fragment>
      ) : (
        <FacebookLogin isChecked={privacyPolicyAccepted} />
      )}
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  reCaptchaCheck: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register, reCaptchaCheck })(
  Register
);
