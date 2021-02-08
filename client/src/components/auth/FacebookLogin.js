import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLoginWithButton from 'react-facebook-login';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import FinishRegister from './FinishRegister';

const FacebookLogin = ({ isChecked, setAlert, register, isAuthenticated }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    id: '',
  });

  const { name, email, id } = userData;

  const type = 'facebook';

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
    await register(response.name, response.email, null, type, response.id);
  };

  return (
    <Fragment>
      {id ? (
        <FinishRegister facebookname={name} email={email} id={id} />
      ) : (
        <LoginButton />
      )}
    </Fragment>
  );
};

FacebookLogin.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
})(FacebookLogin);
