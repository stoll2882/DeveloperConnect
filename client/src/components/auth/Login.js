// rafc creates react component
import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  login,
  dispatchExpireCaptcha,
  dispatchTwoFactorAuth,
} from '../../actions/auth';
import FacebookReLogin from './FacebookReLogin';
import GmailReLogin from './GmalReLogin';
import ReCAPTCHA from 'react-google-recaptcha';
import { reCaptchaCheck } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import TwoFactorLoginConfirmation from './TwoFactorLoginConfirmation';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

export const Login = ({
  login,
  isAuthenticated,
  facebookAttempted,
  twoFactorAttempted,
  googleAttempted,
  recaptchaApproved,
  dispatchExpireCaptcha,
  dispatchTwoFactorAuth,
  reCaptchaCheck,
  setAlert,
  auth: { user },
}) => {
  if (facebookAttempted) {
    window.location.reload();
  }
  // } else if (twoFactorAttempted) {
  //   window.location.reload();
  // }
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

  const { email, password } = formData;

  var human = recaptchaApproved;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (human == false) {
      setAlert('Please verify you are human', 'danger');
    } else {
      await login(email, password, null);
      // if (!facebookAttempted && !googleAttempted) {
      //   dispatchTwoFactorAuth();
      // }
    }
    // }
  };

  const verifyCaptcha = (response) => {
    reCaptchaCheck(response);
  };

  const expireCaptcha = () => {
    dispatchExpireCaptcha();
    setFormData({ ...formData, human: false });
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      {/* {!isAuthenticated || facebookAttempted || googleAttempted ? ( */}
      <Fragment>
        <h1 className="large text-primary">Login</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <Tabs>
          <TabList>
            <Tab>Login With Site Account</Tab>
            <Tab>Login With Facebook</Tab>
            <Tab>Login With Google</Tab>
          </TabList>
          <TabPanel>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
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
              <ReCAPTCHA
                sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
                render="explicit"
                onChange={verifyCaptcha}
                onExpired={expireCaptcha}
              />
              <br></br>
              <input type="submit" className="btn btn-primary" value="Login" />
            </form>
          </TabPanel>
          <TabPanel>
            <ReCAPTCHA
              sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
              render="explicit"
              onChange={verifyCaptcha}
              onExpired={expireCaptcha}
            />
            <br></br>
            <FacebookReLogin />
          </TabPanel>
          <TabPanel>
            <ReCAPTCHA
              sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
              render="explicit"
              onChange={verifyCaptcha}
              onExpired={expireCaptcha}
            />
            <br></br>
            <GmailReLogin />
          </TabPanel>
        </Tabs>
        <br></br>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </Fragment>
      {/* ) : (
        // <Fragment />
        <TwoFactorLoginConfirmation email={email} />
      )} */}
      {/* <Widget
          handleNewUserMessage={handleNewUserMessage}
          // profileAvatar={logo}
          title="Have a question?"
          subtitle="We are here to help!"
        /> */}
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  facebookAttempted: PropTypes.bool,
  reCaptchaCheck: PropTypes.func.isRequired,
  dispatchExpireCaptcha: PropTypes.func.isRequired,
  dispatchTwoFactorAuth: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
  twoFactorAttempted: PropTypes.bool,
  googleAttemped: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  facebookAttempted: state.auth.facebookAttempted,
  recaptchaApproved: state.auth.recaptchaApproved,
  twoFactorAttempted: state.auth.twoFactorAttempted,
  googleAttempted: state.auth.googleAttempted,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  login,
  reCaptchaCheck,
  dispatchExpireCaptcha,
  setAlert,
  dispatchTwoFactorAuth,
})(Login);
