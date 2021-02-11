import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FacebookLoginWithButton from 'react-facebook-login';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import FacebookLogin from './FacebookLogin';
import { setAlert } from '../../actions/alert';

export const FacebookReLogin = ({
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
    <FacebookLoginWithButton
      appId="921874351684228"
      // autoLoad
      fields="name,email,id"
      callback={facebookResponse}
      icon="fa-facebook"
    />
  );

  const facebookResponse = (response) => {
    setUserData({
      name: response.name,
      email: response.email,
      id: response.id,
    });
    if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      login(response.email, null, response.id);
    }
  };

  return (
    <Fragment>
      <LoginButton />
    </Fragment>
  );
};

FacebookReLogin.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, { login, setAlert })(FacebookReLogin);
