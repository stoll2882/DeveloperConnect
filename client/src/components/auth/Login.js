// rafc creates react component
import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, dispatchExpireCaptcha } from '../../actions/auth';
import FacebookReLogin from './FacebookReLogin';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCaptchaCheck } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

export const Login = ({
  login,
  isAuthenticated,
  facebookAttempted,
  recaptchaApproved,
  dispatchExpireCaptcha,
  reCaptchaCheck,
  setAlert,
}) => {
  if (facebookAttempted) {
    window.location.reload();
  }
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  var human = recaptchaApproved;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      login(email, password, null);
    }
  };

  const verifyCaptcha = (response) => {
    reCaptchaCheck(response);
  };

  const expireCaptcha = () => {
    dispatchExpireCaptcha();
    setFormData({ ...formData, human: false });
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Login</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <FacebookReLogin />
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
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
        <ReCAPTCHA
          sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
          render="explicit"
          onChange={verifyCaptcha}
          onExpired={expireCaptcha}
        />
        <br></br>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
  reCaptchaCheck: PropTypes.func.isRequired,
  dispatchExpireCaptcha: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  facebookAttempted: state.auth.facebookAttempted,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, {
  login,
  reCaptchaCheck,
  dispatchExpireCaptcha,
  setAlert,
})(Login);
