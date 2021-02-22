import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import FacebookLogin from './FacebookLogin';
import { setAlert } from '../../actions/alert';
import GmailLogin from './GmailLogin';

export const GmailReLogin = ({
  login,
  isAuthenticated,
  setAlert,
  recaptchaApproved,
}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    id: '',
  });

  const { name, email, id } = userData;

  var human = recaptchaApproved;

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const LoginButton = () => (
    <GoogleLogin
      clientId="753445575160-cajf8p3ntsdrkhj6s744a7gflmdscd0j.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      type="dark"
    />
  );

  const responseGoogle = (response) => {
    setUserData({
      name: response.profileObj.name,
      email: response.profileObj.email,
      id: response.googleId,
    });
    if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      login(response.profileObj.email, null, response.googleId);
    }
  };

  return (
    <Fragment>
      <LoginButton />
    </Fragment>
  );
};

GmailReLogin.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, { login, setAlert })(GmailReLogin);
