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

const PasswordReset = ({
  setAlert,
  isAuthenticated,
  twoFactorAuth,
  twoFactorApproved,
  twoFactorAuthCheck,
  register,
  sendWelcomeEmail,
}) => {
//   useEffect(() => {
//     twoFactorAuth(email, phoneNumber);
//   }, [twoFactorAuth]);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

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
    //   register(name, email, password, phoneNumber, type, null);
    }
  };

  const backClicked = () => {
    window.location.reload();
  };

  const handleCodeChange = (event) => {
    setConfirmationCode(event.target.value);
    // twoFactorAuthCheck(email, event.target.value);
    // twoFactorAuthCheck(email, confirmationCode);
  };

  const sendCodeClicked = () => {
      if (codeSent == false) {
          setCodeSent(true);
      }
  }

  return (
    <Fragment>
      <button className="btn" onClick={backClicked}>
        Cancel
      </button>
      <Link className="btn btn-light my-1" to="/login">
        Go Back
      </Link>
      <br></br>
      <br></br>
      <h1 className="large text-primary">Let's Make Sure it is Really You...</h1>
      <h2>
        Please enter your email:
      </h2>
      <br></br>
      <form className="form" onSubmit={sendCodeClicked}>
        <input
            type="text"
            id="email"
            maxLength="50"
            minLength="6"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
        />{' '}
        <br></br>
        { !codeSent &&
            <input type="submit" className="btn btn-primary" value="Get Code" style={{ width: '7rem', height: '2.5rem' }} />
        }
      </form>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        { codeSent && 
            <div>
                <h2>If you are in our system, a code was sent to your phone number. Enter it below to reset your password!</h2>
                <br></br>
                <input
                    type="text"
                    id="confirmationCode"
                    maxLength="6"
                    name="confirmationCode"
                    value={confirmationCode}
                    // onChange={handleCodeChange}
                />
                <br></br>
                <button className="btn">Resend Code</button>
                <br></br>
                <br></br>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </div>    
        }
      <p className="my-1">
        {/* Already have an account? <Link to="/login">Sign In</Link> */}
      </p>
      </form>
    </Fragment>
  );
};

PasswordReset.propTypes = {
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
})(PasswordReset);