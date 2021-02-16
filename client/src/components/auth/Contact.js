import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendTextMessage } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const Contact = ({ setAlert, sendTextMessage, auth: { user } }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    message: '',
  });

  const { phoneNumber, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = user.name;
    sendTextMessage(name, phoneNumber, message);
    setFormData({
      phoneNumber: '',
      message: '',
    });
    setAlert('Your message has been sent');
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
        {/* <style type="text/css">
            #twilio-connect-button { background: url(https://www.twilio.com/bundles/connect-apps/img/connect-button.png); width: 130px; height: 34px; display: block; margin: 0 auto 
            #twilio-connect-button:hover { background-position: 0 34px; }
</style>
<a href="https://www.twilio.com/authorize/CN91c60e1e53b800a4520341ba9cbfbbcc" id="twilio-connect-button"></a>  */}
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
});

export default connect(mapStateToProps, { sendTextMessage, setAlert })(Contact);
