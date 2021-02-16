import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendTextMessage } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

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
