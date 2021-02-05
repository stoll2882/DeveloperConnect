import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLoginWithButton from 'react-facebook-login';
import { setAlert } from '../../actions/alert';
import { registerFacebook } from '../../actions/auth';

const FacebookLogin = ({
  isChecked,
  setAlert,
  registerFacebook,
  isAuthenticated,
}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    id: '',
  });

  const { name, email, id } = userData;

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

  const UserScreen = () => (
    <div>
      <h1>Welcome {name}!</h1>
      <p>{email}</p>
      <p>{id}</p>
    </div>
  );

  const facebookResponse = (response) => {
    // if (!isChecked) {
    //   setAlert('Please accept the terms and conditions', 'danger');
    // } else {
    setUserData({
      name: response.name,
      email: response.email,
      id: response.id,
    });
    registerFacebook(name, email, id);
    // }
  };

  return <Fragment>{name ? <UserScreen /> : <LoginButton />}</Fragment>;
};

FacebookLogin.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerFacebook: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, registerFacebook })(
  FacebookLogin
);
