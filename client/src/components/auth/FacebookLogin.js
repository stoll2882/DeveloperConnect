import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLoginWithButton from 'react-facebook-login';
import { setAlert } from '../../actions/alert';
import { registerFacebook, register } from '../../actions/auth';
import FinishRegister from './FinishRegister';

const FacebookLogin = ({
  isChecked,
  setAlert,
  registerFacebook,
  register,
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
      autoLoad
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

  const facebookResponse = async (response) => {
    // response.preventDefault();
    setUserData({
      name: response.name,
      email: response.email,
      id: response.id,
    });
    // <FinishRegister facebookName={name} email={email} id={id}
    await register(response.name, response.email, null, response.id);
    // return <Redirect to="/dashboard" />;
  };

  return (
    <Fragment>
      {name ? (
        <FinishRegister facebookname={name} email={email} id={id} />
      ) : (
        <LoginButton />
      )}
    </Fragment>
  );
};

FacebookLogin.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerFacebook: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  setAlert,
  registerFacebook,
  register,
})(FacebookLogin);
