import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import {
  register,
  attemptFacebook,
  dispatchExpireCaptcha,
  twoFactorAuth,
  dispatchTwoFactorAuth,
} from '../../actions/auth';
import FacebookLoginWithButton from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { reCaptchaCheck } from '../../actions/auth';
import FinishRegister from './FinishRegister';
import FacebookLogin from './FacebookLogin';
// import GoogleLogin from './GmailLogin';
import ReCAPTCHA from 'react-google-recaptcha';
import PropTypes from 'prop-types';
import GmailLogin from './GmailLogin';
import PhoneInput from 'react-phone-number-input';
import TwoFactorConfirmation from './TwoFactorConfirmation';

const Register = ({
  setAlert,
  register,
  attemptFacebook,
  reCaptchaCheck,
  dispatchExpireCaptcha,
  isAuthenticated,
  recaptchaApproved,
  facebookAttempted,
  twoFactorAttempted,
  twoFactorAuth,
  dispatchTwoFactorAuth,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    id: '',
    facebookOption: false,
    phoneNumber: '',
  });

  const [userData, setUserData] = useState({
    fbName: 'name',
    fbEmail: 'email',
    fbId: 'id',
  });

  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const [twoFactorAuthCode, setTwoFactorAuthCode] = useState('');

  const {
    name,
    email,
    password,
    password2,
    id,
    facebookOption,
    phoneNumber,
  } = formData;

  var human = recaptchaApproved;

  const type = 'self';

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else if (!privacyPolicyAccepted) {
      setAlert('Please accept the terms and conditions', 'danger');
    } else if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      // generateCode();
      dispatchTwoFactorAuth();
      // await register(name, email, password, phoneNumber, type, null);
    }
  };

  const recaptchaRef = React.createRef();

  const verifyCaptcha = (response) => {
    reCaptchaCheck(response);
  };

  const expireCaptcha = () => {
    dispatchExpireCaptcha();
    setFormData({ ...formData, human: false });
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  // if (twoFactorAttempted) {
  //   return <Redirect to="/twofactorconfirmation" />;
  // }

  const facebookChosen = () => {
    setFormData({ facebookOption: true });
  };

  const FacebookLoginButton = () => (
    <FacebookLoginWithButton
      appId="921874351684228"
      fields="name,email,id"
      callback={facebookResponse}
      icon="fa-facebook"
      textButton="Register with Facebook"
      // onClick={facebookClicked}
    />
  );

  const loginGoogle = (response) => {
    console.log(response);
  };

  // const GoogleLoginButton = () => (
  //   // <p>Hi</p>

  // );

  const facebookResponse = async (response) => {
    await attemptFacebook();
    setFormData({
      name: response.name,
      email: response.email,
      id: response.id,
    });
  };

  const responseGoogle = async (response) => {
    console.log(response);
  };

  // const generateCode = () => {
  //   const randomCode = Math.floor(100000 + Math.random() * 900000);
  //   setTwoFactorAuthCode(`${randomCode}`);
  // };

  const onPhoneChange = (e) => {
    setFormData({ ...formData, phoneNumber: e });
  };

  return (
    <Fragment>
      {!facebookAttempted ? (
        !twoFactorAttempted ? (
          <Fragment>
            <h1 className="large text-primary">Register</h1>
            <p className="lead">
              <i className="fas fa-user"></i> Create Your Account
            </p>
            {/* <GoogleLogin
            clientId="753445575160-cajf8p3ntsdrkhj6s744a7gflmdscd0j.apps.googleusercontent.com"
            buttonText="Log in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          /> */}
            <FacebookLoginButton onChange={facebookChosen} />
            <br></br>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
              <small className="form-text">
                If you do not register with facebook, you will be prompted for
                two-factor-authentication
              </small>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  id="namefield"
                  value={name}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  id="emailfield"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
                />
                <small className="form-text">
                  This site uses Gravatar so if you want a profile image, use a
                  Gravatar email
                </small>
              </div>
              <PhoneInput
                maxLength="15"
                minLength="4"
                id="phoneNumber"
                //   style={{ height: '30px', maxWidth: '270px' }}
                defaultCountry="US"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => onPhoneChange(e)}
              />
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  minLength="6"
                  value={password}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  minLength="6"
                  value={password2}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
                render="explicit"
                onChange={verifyCaptcha}
                onExpired={expireCaptcha}
              />
              <br></br>
              <input
                type="checkbox"
                id="privacypolicy"
                name="privacypolicy"
                value="privacypolicy"
                onChange={(e) =>
                  setPrivacyPolicyAccepted(!privacyPolicyAccepted)
                }
              />{' '}
              <label htmlFor="privacypolicy">
                I agree to the{' '}
                <Link to="/privacypolicy">
                  privacy policy and terms of service
                </Link>
              </label>
              <br></br>
              <br></br>
              <input
                type="submit"
                className="btn btn-primary"
                value="Register"
              />
            </form>
            <p className="my-1">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </Fragment>
        ) : (
          <TwoFactorConfirmation
            name={name}
            email={email}
            password={password}
            phoneNumber={phoneNumber}
          />
        )
      ) : (
        <FinishRegister
          facebookName={name}
          email={email}
          id={id}
          twoFactorAuthCode={twoFactorAuthCode}
        />
      )}
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  attemptFacebook: PropTypes.func.isRequired,
  reCaptchaCheck: PropTypes.func.isRequired,
  twoFactorAuth: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  dispatchExpireCaptcha: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
  twoFactorAttempted: PropTypes.bool,
  dispatchTwoFactorAuth: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
  facebookAttempted: state.auth.facebookAttempted,
  twoFactorAttempted: state.auth.twoFactorAttempted,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  reCaptchaCheck,
  attemptFacebook,
  dispatchExpireCaptcha,
  twoFactorAuth,
  dispatchTwoFactorAuth,
})(Register);
