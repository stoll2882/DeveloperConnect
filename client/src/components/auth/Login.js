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
  twoFactorApproved,
}) => {
  if (facebookAttempted || twoFactorApproved) {
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

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

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

  return (
    <Fragment>
      {/* {!isAuthenticated || facebookAttempted || googleAttempted ? ( */}
      <Fragment>
        <h1 className="large text-primary">Login</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <Tabs>
          <TabList>
            <Tab style={{
               border: '0.1rem solid grey',
               borderBottom: '0',
               borderTopLeftRadius: '5px', 
               borderTopRightRadius: '5px',
             }}><img src="email-logo.png" style={{ maxWidth: '124px', marginBottom: '-10px' }}></img></Tab>
            <Tab style={{
               border: '0.1rem solid grey',
               borderBottom: '0',
               borderTopLeftRadius: '5px', 
               borderTopRightRadius: '5px',
               marginLeft: '5px',
            }}><img src="facebook-logo.png" style={{ maxWidth: '151px' }}></img></Tab>
            <Tab style={{
               border: '0.1rem solid grey',
               borderBottom: '0',
               borderTopLeftRadius: '5px', 
               borderTopRightRadius: '5px',
               marginLeft: '5px',
            }}><img src="google-logo.png" style={{ maxWidth: '128px', marginBottom: '-10px' }}></img></Tab>
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
              <p className="my-1">
                Forgot your password? Reset it <Link to="/passwordreset">Here</Link>
              </p>
            </form>
          </TabPanel>
          <TabPanel>
            <FacebookReLogin />
            <br></br>
            <br></br>
            <ReCAPTCHA
              sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
              render="explicit"
              onChange={verifyCaptcha}
              onExpired={expireCaptcha}
            />
          </TabPanel>
          <TabPanel>
            <GmailReLogin />
            <br></br>
            <br></br>
            <ReCAPTCHA
              sitekey="6Le2z0oaAAAAABG-NkcbHXAHv03pkxHdwRzak2IA"
              render="explicit"
              onChange={verifyCaptcha}
              onExpired={expireCaptcha}
            />
          </TabPanel>
        </Tabs>
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
  twoFactorApproved: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  facebookAttempted: state.auth.facebookAttempted,
  recaptchaApproved: state.auth.recaptchaApproved,
  twoFactorAttempted: state.auth.twoFactorAttempted,
  twoFactorApproved: state.auth.twoFactorApproved,
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
