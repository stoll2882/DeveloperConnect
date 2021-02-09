import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLoginWithButton from 'react-facebook-login';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import FinishRegister from './FinishRegister';

const FacebookLogin = ({
  privacyPolicyAccepted,
  setAlert,
  register,
  isAuthenticated,
  facebookAttempted,
}) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    id: '',
  });

  const { name, email, id } = userData;
  var tempName;
  var tempEmail;
  var tempID;

  const type = 'facebook';

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const facebookClicked = () => {
    // if (!privacyPolicyAccepted) {
    //   setAlert(
    //     'Please accept the terms and conditions before registering with facebook',
    //     'danger'
    //   );
    // }
  };

  const LoginButton = () => (
    <FacebookLoginWithButton
      appId="921874351684228"
      fields="name,email,id"
      callback={facebookResponse}
      icon="fa-facebook"
      onClick={facebookClicked}
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
    // response.preventDefault();
    if (facebookAttempted) {
      const firstVal = 'name';
      const secondVal = 'email';
      const thirdVal = 'id';
      setUserData({ ...userData, [firstVal]: response.name });
      setUserData({ ...userData, [secondVal]: response.email });
      setUserData({ ...userData, [thirdVal]: response.id });
      console.log('setdata');
    }
    register(response.name, response.email, null, type, response.id);
  };

  return (
    <Fragment>
      {name ? <FinishRegister props={(name, email, id)} /> : <LoginButton />}
    </Fragment>
  );
};

FacebookLogin.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  facebookAttempted: state.auth.facbookAttempted,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
})(FacebookLogin);
