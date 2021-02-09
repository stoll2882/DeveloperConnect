import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import FacebookLoginWithButton from 'react-facebook-login';
import { setAlert } from '../../actions/alert';
import { register, attemptFacebook } from '../../actions/auth';
import FinishRegister from './FinishRegister';

const FacebookLogin = ({
  setAlert,
  register,
  isAuthenticated,
  facebookAttempted,
  attemptFacebook,
}) => {
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [id, setId] = useState('');

  const type = 'facebook';

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const LoginButton = () => (
    <FacebookLoginWithButton
      appId="921874351684228"
      fields="name,email,id"
      callback={facebookResponse}
      icon="fa-facebook"
      // onClick={facebookClicked}
    />
  );

  // const facebookClicked = () => {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/finishregister',
  //         state: { facebookName: { name }, email: { email }, id: { id } },
  //       }}
  //     />
  //   );
  // };

  const facebookResponse = async (response) => {
    setName(response.name);
    setEmail(response.email);
    setId(response.id);
  };

  // if (name) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/finishregister',
  //         state: { facebookName: { name }, email, id },
  //         // state: { facebookName: { name }, email: { email }, id: { id } },
  //       }}
  //     />
  //   );
  // }

  return (
    <Fragment>
      {/* <LoginButton /> */}
      <h1>name is... {name}</h1>
      {name ? (
        <FinishRegister facebookName={name} email={email} id={id} />
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
  facebookAttempted: PropTypes.bool,
  attemptFacebook: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  facebookAttempted: state.auth.facbookAttempted,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  attemptFacebook,
})(FacebookLogin);
