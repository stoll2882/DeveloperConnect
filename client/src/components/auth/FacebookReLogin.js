import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FacebookLoginWithButton from 'react-facebook-login';
import PropTypes from 'prop-types';
import { login, loginFacebook } from '../../actions/auth';
import FacebookLogin from './FacebookLogin';

export const FacebookReLogin = ({ login, isAuthenticated }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    id: '',
  });

  const { name, email, id } = userData;

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

    login(response.email, null, response.id);
  };

  return (
    <Fragment>
      <LoginButton />
    </Fragment>
  );
};

FacebookReLogin.propTypes = {
  login: PropTypes.func.isRequired,
  loginFacebook: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login, loginFacebook })(
  FacebookReLogin
);
