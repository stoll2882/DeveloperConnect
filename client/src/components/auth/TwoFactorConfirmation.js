import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, dispatchExpireCaptcha } from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';
import PropTypes from 'prop-types';

const TwoFactorConfirmation = ({
  name,
  email,
  phoneNumber,
  password,
  setAlert,
  isAuthenticated,
}) => {
  const [confirmationCode, setConfirmationCode] = useState('');

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setAlert('Phone number is required', 'danger');
    } else {
      const type = 'self';
      register(name, email, password, phoneNumber, type, null);
    }
  };

  //   if (isAuthenticated) {
  //     return <Redirect to="/dashboard" />;
  //   }

  const backClicked = () => {
    window.location.reload();
  };

  const generateCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setTwoFactorAuthCode(`${randomCode}`);
  };

  return (
    <Fragment>
      <button className="btn" onClick={backClicked}>
        Cancel
      </button>
      <br></br>
      <br></br>
      <h1 className="large text-primary">You're almost there {name}</h1>
      <h2>Name: {name}</h2>
      <h2>Email: {email}</h2>
      <h2>Password: {password}</h2>
      <h2>Code: {twoFactorAuthCode}</h2>
      <h2>Confirmation code sent to: {phoneNumber}</h2>
      {/* <h2>{id}</h2> */}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <br></br>
        <input
          type="text"
          id="confirmationCode"
          name="confirmationCode"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.value)}
        />{' '}
        <br></br>
        <input type="submit" className="btn btn-primary" value="Register" />
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
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  setAlert,
})(TwoFactorConfirmation);
