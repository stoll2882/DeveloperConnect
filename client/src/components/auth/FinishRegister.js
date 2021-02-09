import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PhoneInput from 'react-phone-number-input';

import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GmailLogin';
import ReCAPTCHA from 'react-google-recaptcha';

import PropTypes from 'prop-types';
import { check } from 'express-validator';

const FinishRegister = ({
  facebookName,
  email,
  id,
  setAlert,
  register,
  isAuthenticated,
}) => {
  const [formData, setFormData] = useState({
    alias: '',
    phoneNumber: '',
  });
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const { alias, phoneNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!privacyPolicyAccepted) {
      setAlert('Please accept the terms and conditions', 'danger');
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

  return (
    <Fragment>
      <button className="btn" onClick={backClicked}>
        Back
      </button>
      <br></br>
      <br></br>
      <h1 className="large text-primary">You're almost there...</h1>
      <h2>Name: {facebookName}</h2>
      <h2>Email: {email}</h2>
      {/* <h2>{id}</h2> */}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        {/* <div className="form-group">
          <input
            type="text"
            placeholder="What would you like to be called?"
            name="name"
            value={alias}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Enter Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => onChange(e)}
            required
          />
        </div> */}
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
          <Link to="/privacypolicy">privacy policy and terms of service</Link>
        </label>
        <br></br>
        <br></br>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        {/* Already have an account? <Link to="/login">Sign In</Link> */}
      </p>
    </Fragment>
  );
};

FinishRegister.propTypes = {
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
})(FinishRegister);
