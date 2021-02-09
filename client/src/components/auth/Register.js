import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, attemptFacebook } from '../../actions/auth';
import FacebookLoginWithButton from 'react-facebook-login';
import { reCaptchaCheck } from '../../actions/auth';
import FinishRegister from './FinishRegister';

import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GmailLogin';
import ReCAPTCHA from 'react-google-recaptcha';

import PropTypes from 'prop-types';
import { check } from 'express-validator';

const Register = ({
  setAlert,
  register,
  attemptFacebook,
  reCaptchaCheck,
  isAuthenticated,
  recaptchaApproved,
  facebookAttempted,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    id: '',
    facebookOption: false,
  });

  const [userData, setUserData] = useState({
    fbName: 'name',
    fbEmail: 'email',
    fbId: 'id',
  });

  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const { name, email, password, password2, id, facebookOption } = formData;

  var human = recaptchaApproved;

  const type = 'self';

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else if (!privacyPolicyAccepted) {
      setAlert('Please accept the terms and conditions', 'danger');
    } else if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      await register(name, email, password, type, null);
    }
  };

  const verifyCaptcha = (response) => {
    reCaptchaCheck(response);
  };

  const expireCaptcha = () => {
    setFormData({ ...formData, human: false });
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const facebookChosen = () => {
    setFormData({ facebookOption: true });
  };

  const FacebookLoginButton = () => (
    <FacebookLoginWithButton
      appId="921874351684228"
      fields="name,email,id"
      callback={facebookResponse}
      icon="fa-facebook"
      // onClick={facebookClicked}
    />
  );

  const facebookResponse = async (response) => {
    await attemptFacebook();
    setFormData({
      name: response.name,
      email: response.email,
      id: response.id,
    });
  };

  return (
    <Fragment>
      {!facebookAttempted ? (
        <Fragment>
          <h1 className="large text-primary">Sign Up</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Create Your Account
          </p>
          <FacebookLoginButton onChange={facebookChosen} />
          <GoogleLogin />
          <form className="form" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                name="name"
                id="namefield"
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
                id="emailfield"
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
              render="explicit"
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
            <label htmlFor="privacypolicy">
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
        <FinishRegister facebookName={name} email={email} id={id} />
      )}
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  attemptFacebook: PropTypes.func.isRequired,
  reCaptchaCheck: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  recaptchaApproved: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
  facebookAttempted: state.auth.facebookAttempted,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  reCaptchaCheck,
  attemptFacebook,
})(Register);
