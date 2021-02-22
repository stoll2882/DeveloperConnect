import React, { Fragment, useState, useEffect } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import {
  register,
  dispatchExpireCaptcha,
  twoFactorAuth,
  twoFactorAuthCheck,
  sendWelcomeEmail,
} from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';
import PropTypes from 'prop-types';

const TwoFactorConfirmation = ({
  name,
  email,
  phoneNumber,
  password,
  setAlert,
  isAuthenticated,
  twoFactorAuth,
  twoFactorApproved,
  twoFactorAuthCheck,
  register,
  sendWelcomeEmail,
}) => {
  useEffect(() => {
    twoFactorAuth(email, phoneNumber);
  }, [twoFactorAuth]);
  const [confirmationCode, setConfirmationCode] = useState('');

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState('');

  var approved = twoFactorApproved;

  const checkConfirmationCode = (value) => {
    setConfirmationCode(value);
    twoFactorAuthCheck(email, confirmationCode);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await twoFactorAuthCheck(email, confirmationCode);
    if (!result) {
      setAlert('Security Code Incorrect', 'danger');
    } else {
      const type = 'self';
      // sendWelcomeEmail(email, name);
      register(name, email, password, phoneNumber, type, null);
    }
  };

  //   if (isAuthenticated) {
  //     return <Redirect to="/dashboard" />;
  //   }

  const backClicked = () => {
    window.location.reload();
  };

  if (isAuthenticated) {
    // sendWelcomeEmail(email, name);
    return <Redirect to="/dashboard" />;
  }

  // const generateCode = () => {
  //   const randomCode = Math.floor(100000 + Math.random() * 900000);
  //   setTwoFactorAuthCode(`${randomCode}`);
  // };

  const handleCodeChange = (event) => {
    setConfirmationCode(event.target.value);
    // twoFactorAuthCheck(email, event.target.value);
    // twoFactorAuthCheck(email, confirmationCode);
  };

  return (
    <Fragment>
      <button className="btn" onClick={backClicked}>
        Cancel
      </button>
      <br></br>
      <br></br>
      <h1 className="large text-primary">Please verify it is you, {name}</h1>
      {/* <h2>Name: {name}</h2>
      <h2>Email: {email}</h2>
      <h2>Password: {password}</h2>
      <h2>Code: {twoFactorAuthCode}</h2> */}
      <h2>
        Security code sent to: ******
        {phoneNumber.substr(phoneNumber.length - 4)}
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

TwoFactorConfirmation.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  twoFactorAuth: PropTypes.func.isRequired,
  twoFactorAuthCheck: PropTypes.func.isRequired,
  twoFactorApproved: PropTypes.bool,
  register: PropTypes.func.isRequired,
  sendWelcomeEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  twoFactorApproved: state.auth.twoFactorApproved,
});

export default connect(mapStateToProps, {
  setAlert,
  twoFactorAuth,
  twoFactorAuthCheck,
  register,
  sendWelcomeEmail,
})(TwoFactorConfirmation);
