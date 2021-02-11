import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, dispatchExpireCaptcha } from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';

import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GmailLogin';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCaptchaCheck } from '../../actions/auth';

import PropTypes from 'prop-types';
import PrivacyPolicy from './PrivacyNotice';

const FinishRegister = ({
  facebookName,
  email,
  id,
  setAlert,
  register,
  isAuthenticated,
  dispatchExpireCaptcha,
  recaptchaApproved,
  reCaptchaCheck,
}) => {
  const [formData, setFormData] = useState({
    alias: '',
    phoneNumber: '',
  });
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const { alias, phoneNumber } = formData;

  var human = recaptchaApproved;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const verifyCaptcha = (response) => {
    reCaptchaCheck(response);
  };

  const expireCaptcha = () => {
    dispatchExpireCaptcha();
    setFormData({ ...formData, human: false });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!privacyPolicyAccepted) {
      setAlert('Please accept the terms and conditions', 'danger');
    } else if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      const type = 'facebook';
      register(facebookName, email, null, type, id);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const backClicked = () => {
    window.location.reload();
  };

  const conditionsClicked = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
  };

  return (
    <Fragment>
      <button className="btn" onClick={backClicked}>
        Cancel
      </button>
      <br></br>
      <br></br>
      <h1 className="large text-primary">You're almost there...</h1>
      <h2>Name: {facebookName}</h2>
      <h2>Email: {email}</h2>
      {/* <h2>{id}</h2> */}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <br></br>
        <input
          type="checkbox"
          id="privacypolicy"
          name="privacypolicy"
          value="privacypolicy"
          onChange={(e) => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
        />{' '}
        <label htmlFor="privacypolicy">
          I agree to the{' '}
          <Link onClick={conditionsClicked}>
            privacy policy and terms of service
          </Link>
          {/* <Link to="/privacypolicy">privacy policy and terms of service</Link> */}
        </label>
        <br></br>
        <br></br>
        <ReCAPTCHA
          sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
          render="explicit"
          onChange={verifyCaptcha}
          onExpired={expireCaptcha}
        />
        <br></br>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        {/* Already have an account? <Link to="/login">Sign In</Link> */}
      </p>
      {showPrivacyPolicy == true && <PrivacyPolicy />}
    </Fragment>
  );
};

FinishRegister.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  reCaptchaCheck: PropTypes.func.isRequired,
  dispatchExpireCaptcha: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  reCaptchaCheck,
  dispatchExpireCaptcha,
})(FinishRegister);
