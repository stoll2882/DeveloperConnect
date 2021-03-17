import React, { Fragment, useState, useEffect } from 'react';
// import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import {
  register,
  dispatchExpireCaptcha,
  twoFactorAuth,
  twoFactorAuthCheckPasswordReset,
  sendWelcomeEmail,
  findPhoneNumber,
  changePassword
} from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';
import PropTypes from 'prop-types';

const PasswordReset = ({
  setAlert,
  isAuthenticated,
  twoFactorAuth,
  twoFactorApproved,
  twoFactorAuthCheckPasswordReset,
  register,
  sendWelcomeEmail,
  findPhoneNumber,
  changePassword,
}) => {
//   useEffect(() => {
//     twoFactorAuth(email, phoneNumber);
//   }, [twoFactorAuth]);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState('');

  var approved = twoFactorApproved;

  const checkConfirmationCode = (value) => {
    setConfirmationCode(value);
    twoFactorAuthCheckPasswordReset(email, confirmationCode);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await twoFactorAuthCheckPasswordReset(email, confirmationCode);
    if (!result) {
      setAlert('Security Code Incorrect', 'danger');
    } else {
      const type = 'self';
      // sendWelcomeEmail(email, name);
    //   register(name, email, password, phoneNumber, type, null);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (password1 != password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      await changePassword(email, password1);
    }
  };

//   const backClicked = () => {
//     window.location.reload();
//   };

  const handleCodeChange = (event) => {
    setConfirmationCode(event.target.value);
    // twoFactorAuthCheck(email, event.target.value);
    // twoFactorAuthCheck(email, confirmationCode);
  };

  const sendCodeClicked = () => {
      if (codeSent == false) {
          findPhoneNumber(email);
          setCodeSent(true);
      }
  }

  return (
    <Fragment>
      {/* <button className="btn" onClick={backClicked}>
        Cancel
      </button> */}
      <Link className="btn btn-light my-1" to="/login">
         Go Back
      </Link>
      { !twoFactorApproved ? (
          <div>
              <br></br>
                <br></br>
                <h1 className="large text-primary">Let's Make Sure it is Really You...</h1>
                <h2>
                    Please enter your email:
                </h2>
                <br></br>
                <form className="form" >
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
                        <input className="btn btn-primary" value="Get Code" style={{ width: '7rem', height: '2.5rem' }} onClick={sendCodeClicked} />
                    }
                </form>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                    { codeSent && 
                        <div>
                            <h2>If you are in our system, a code was sent to your phone number. Enter it below to reset your password!</h2>
                            <br></br>
                            <input
                                type="password"
                                id="confirmationCode"
                                maxLength="6"
                                name="confirmationCode"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                            />
                            <br></br>
                            <button className="btn">Resend Code</button>
                            <br></br>
                            <br></br>
                            <input type="submit" className="btn btn-primary" value="Submit" />
                        </div>   
                    }
                </form>
        </div>
      ) : (
        <div>
              <div>
                  <h2>Your account has been confirmed.</h2>
                  <form className="form"  onSubmit={(e) => submitReset(e)}>
                    <div className="form-group">
                      <h4>Enter new password:</h4>
                      <input
                          type="password"
                          id="password1"
                          maxLength="50"
                          name="password1"
                          value={password1}
                          onChange={(e) => setPassword1(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <h4>Confirm new password:</h4>
                      <input
                          type="password"
                          id="password2"
                          maxLength="50"
                          name="password2"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                      />
                    </div>
                    <br></br>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                  </form>
              </div>   
        </div>
      )
            // 
      // <Link className="btn btn-light my-1" to="/login">
      //   Go Back
      // </Link>
      
      // <p className="my-1">
      //   {/* Already have an account? <Link to="/login">Sign In</Link> */}
      // </p>
    }
    </Fragment>
  );
};

PasswordReset.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  twoFactorAuth: PropTypes.func.isRequired,
  twoFactorAuthCheckPasswordReset: PropTypes.func.isRequired,
  twoFactorApproved: PropTypes.bool,
  register: PropTypes.func.isRequired,
  sendWelcomeEmail: PropTypes.func.isRequired,
  findPhoneNumber: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  twoFactorApproved: state.auth.twoFactorApproved,
});

export default connect(mapStateToProps, {
  setAlert,
  twoFactorAuth,
  twoFactorAuthCheckPasswordReset,
  register,
  sendWelcomeEmail,
  findPhoneNumber,
  changePassword,
})(PasswordReset);