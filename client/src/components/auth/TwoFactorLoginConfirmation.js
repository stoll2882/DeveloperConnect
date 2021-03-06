import React, { Fragment, useState, useEffect } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import {
  login,
  dispatchExpireCaptcha,
  twoFactorAuth,
  twoFactorAuthCheck,
} from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';
import PropTypes from 'prop-types';

const TwoFactorLoginConfirmation = ({
  email,
  setAlert,
  isAuthenticated,
  twoFactorAuth,
  twoFactorApproved,
  twoFactorAuthCheck,
  login,
  auth: { user },
}) => {
  useEffect(() => {
    twoFactorAuth(email, user.phoneNumber);
  }, [twoFactorAuth]);
  const [confirmationCode, setConfirmationCode] = useState('');

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState('');

  const checkConfirmationCode = (value) => {
    setConfirmationCode(value);
    twoFactorAuthCheck(email, confirmationCode);
  };

  //   const phone = user.phoneNumber;

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await twoFactorAuthCheck(email, confirmationCode);
    if (!result) {
      setAlert('Security Code Incorrect', 'danger');
    } else {
      <Redirect to="/dashboard" />;
    }
  };

  //   if (isAuthenticated) {
  //     return <Redirect to="/dashboard" />;
  //   }

  const backClicked = () => {
    window.location.reload();
  };

  if (twoFactorApproved && isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  // const generateCode = () => {
  //   const randomCode = Math.floor(100000 + Math.random() * 900000);
  //   setTwoFactorAuthCode(`${randomCode}`);
  // };

  const handleCodeChange = (event) => {
    setConfirmationCode(event.target.value);
    // twoFactorAuthCheck(email, confirmationCode);
  };

  return (
    <Fragment>
      {/* <button className="btn" onClick={backClicked}>
        Cancel
      </button> */}
      <br></br>
      <br></br>
      {/* <h1 className="large text-primary">Please verify it is you, {name}</h1> */}
      {/* <h2>Name: {name}</h2>
      <h2>Email: {email}</h2>
      <h2>Password: {password}</h2>
      <h2>Code: {twoFactorAuthCode}</h2> */}
      <h2>
        Security code sent to: ******
        {user.phoneNumber.substr(user.phoneNumber.length - 4)}
      </h2>
      {/* <h2>{id}</h2> */}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <br></br>
        <input
          type="text"
          id="confirmationCode"
          maxLength="6"
          name="confirmationCode"
          value={confirmationCode}
          onChange={handleCodeChange}
        />{' '}
        <br></br>
        <button className="btn">Resend Code</button>
        <br></br>
        <br></br>
        <input type="submit" className="btn btn-primary" value="Continue" />
      </form>
      <p className="my-1">
        {/* Already have an account? <Link to="/login">Sign In</Link> */}
      </p>
    </Fragment>
  );
};

TwoFactorLoginConfirmation.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  twoFactorAuth: PropTypes.func.isRequired,
  twoFactorAuthCheck: PropTypes.func.isRequired,
  twoFactorApproved: PropTypes.bool,
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  twoFactorApproved: state.auth.twoFactorApproved,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  setAlert,
  twoFactorAuth,
  twoFactorAuthCheck,
  login,
})(TwoFactorLoginConfirmation);
