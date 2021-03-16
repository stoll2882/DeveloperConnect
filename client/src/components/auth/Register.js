import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import {
  register,
  attemptFacebook,
  attemptGoogle,
  dispatchExpireCaptcha,
  twoFactorAuth,
  dispatchTwoFactorAuth,
  sendWelcomeEmail,
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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const Register = ({
  setAlert,
  register,
  attemptFacebook,
  attemptGoogle,
  reCaptchaCheck,
  dispatchExpireCaptcha,
  isAuthenticated,
  recaptchaApproved,
  facebookAttempted,
  googleAttempted,
  twoFactorAttempted,
  twoFactorAuth,
  dispatchTwoFactorAuth,
  sendWelcomeEmail,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    id: '',
    type: '',
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

  const [googleObj, setGoogleObj] = useState([]);

  const {
    name,
    email,
    password,
    password2,
    id,
    type,
    facebookOption,
    phoneNumber,
  } = formData;

  var human = recaptchaApproved;

  // const type = 'self';

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

  const handleNewUserMessage = (newMessage) => {
    if (newMessage == 'hello') {
      addResponseMessage(`Hello there!`)
    } else if (newMessage == 'help') {
      addResponseMessage(
        'Thank you for contacting us. Here are your options: \nPress 1 to here how our site works \nPress 2 if you are having a problem with your account \nPress 3 to speak to a live representative'
      )
    } else if (newMessage == '1') {
      addResponseMessage('Developer connect is a social media site that allows developers across the world to connect with one another as well as share their work and find partners for new endevours.')
    }
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

  if (isAuthenticated) {
    sendWelcomeEmail(email, name);
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
      // buttonStyle={{
      //   // height: '50px',
      //   textAlign: 'center',
      //   alignContent: 'center',
      //   alignItems: 'center',
      //   borderRadius: '100px',
      //   padding: '-100px',
      // }}
      // onClick={facebookClicked}
    />
  );

  const GoogleLoginButton = () => (
    <GoogleLogin
      clientId="753445575160-cajf8p3ntsdrkhj6s744a7gflmdscd0j.apps.googleusercontent.com"
      buttonText="Register with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      type="dark"
      // style={{
      //   height: '100px',
      //   padding: '20px',
      //   background: 'red',
      // }}
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
      type: 'facebook',
    });
  };

  const responseGoogle = async (response) => {
    await attemptGoogle();
    setFormData({
      name: response.profileObj.name,
      email: response.profileObj.email,
      id: response.googleId,
      type: 'google',
    });
    console.log(type);
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
      {!facebookAttempted && !googleAttempted ? (
        !twoFactorAttempted ? (
          <Fragment>
            <h1 className="large text-primary">Register</h1>
            <p className="lead">
              <i className="fas fa-user"></i> Create Your Account
            </p>
            <p className="my-1">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
            <Tabs>
            <TabList>
              <Tab>Register With Email</Tab>
              <Tab>Register With Facebook</Tab>
              <Tab>Register With Google</Tab>
            </TabList>
              <TabPanel>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                  <small className="form-text">
                    If you do not register with facebook or google, you will be
                    prompted for two-factor-authentication
                  </small>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      id="namefield"
                      value={name}
                      onChange={(e) => onChange(e)}
                      maxLength={50}
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
                      maxLength={50}
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
                      maxLength={50}
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
                      maxLength={50}
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
              </TabPanel>
              <TabPanel>
                <FacebookLoginButton onChange={facebookChosen} />
              </TabPanel>
              <TabPanel>
                <GoogleLoginButton />
              </TabPanel>
            </Tabs>
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
          type={type}
          // twoFactorAuthCode={twoFactorAuthCode}
        />
      )}
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  attemptFacebook: PropTypes.func.isRequired,
  attemptGoogle: PropTypes.func.isRequired,
  reCaptchaCheck: PropTypes.func.isRequired,
  twoFactorAuth: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  dispatchExpireCaptcha: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
  googleAttempted: PropTypes.bool,
  twoFactorAttempted: PropTypes.bool,
  dispatchTwoFactorAuth: PropTypes.func.isRequired,
  sendWelcomeEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
  facebookAttempted: state.auth.facebookAttempted,
  twoFactorAttempted: state.auth.twoFactorAttempted,
  googleAttempted: state.auth.googleAttempted,
});

export default connect(mapStateToProps, {
  setAlert,
  register,
  reCaptchaCheck,
  attemptFacebook,
  attemptGoogle,
  dispatchExpireCaptcha,
  twoFactorAuth,
  dispatchTwoFactorAuth,
  sendWelcomeEmail,
})(Register);
