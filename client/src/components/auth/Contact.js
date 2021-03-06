import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendTextMessage } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import { CometChat } from "@cometchat-pro/chat"
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import GoogleMapReact from 'google-map-react';
import './map.css';

const Contact = ({
  setAlert,
  sendTextMessage,
  auth: { user },
  isAuthenticated,
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    message: '',
  });

  const { phoneNumber, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = user.name;
    if (!phoneNumber) {
      setAlert('Phone number is required', 'danger');
    } else if (!message) {
      setAlert('Message is required');
    } else {
      sendTextMessage(name, phoneNumber, message);
      setFormData({
        phoneNumber: '',
        message: '',
      });
      setAlert('Your message has been sent');
    }
  };

  const onPhoneChange = (e) => {
    setFormData({ ...formData, phoneNumber: e });
  };

  const handleNewUserMessage = (newMessage) => {
    if (newMessage == 'hello') {
      addResponseMessage(`Hello there, ${user.name}!`)
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

  return (
    <Fragment>
      <h1 className="large text-primary">Contact the Developers</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Connect Directly with Our Sites
        Developers
      </p>
      <p>
        Hi there <strong style={{ fontSize: '1.2rem' }}>{user.name}</strong>,
        enter your phone number and message to contact us directly, and we will
        get back to you as soon as possible!
      </p>
      <br></br>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <PhoneInput
          maxLength="15"
          minLength="4"
          id="phoneNumber"
          //   style={{ height: '30px', maxWidth: '270px' }}
          defaultCountry="US"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e)}
        />
        <div className="form-group">
          <input
            type="text"
            id="message"
            maxLength="50"
            placeholder="Message to developers"
            name="message"
            minLength="6"
            value={message}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Submit" />
      </form>
      <br></br>
      <br></br>
      <h2>Or chat with us directly!</h2>
      <iframe src='https://deadsimplechat.com/oi1_Ch3BI' width='100%' height='500px'></iframe>
      {/* <iframe src="https://deadsimplechat.com/oi1_Ch3BI" style="width: 100%; height: 500px;"></iframe>
       */}
       {/* <Widget
          handleNewUserMessage={handleNewUserMessage}
          // profileAvatar={logo}
          title="Have a question?"
          subtitle="We are here to help!"
        /> */}
    </Fragment>

  );
};

Contact.propTypes = {
  sendTextMessage: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { sendTextMessage, setAlert })(Contact);
