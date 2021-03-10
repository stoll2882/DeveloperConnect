import React, { Fragment, useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { PayPalButton } from 'react-paypal-button-v2';
import PayPal from './PayPal';
import CurrencyInput from 'react-currency-input-field';
import NumericInput from 'react-numeric-input';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

export const Donations = ({ isAuthenticated, setAlert }) => {
  const [amount, setAmount] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const PaypalButton = () => (
    // console.log('Test');
    // <PayPal />
    <PayPalButton
      amount="0.1"
      currency="USD"
      onSuccess={(details, data) => console.log(details)}
      options={{
        clientId:
          'AW4p1KwQzUynoD34z7KZr3KxLLRcDFakLEbOmb5aNnMNh62IBr_py8F3vtcP73oavTfwHtuFx6SAez-r',
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount,
              },
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING', // default is "GET_FROM_FILE"
          },
        });
      }}
      onApprove={() => {
        console.log('Approved');
      }}
      onError={() => {
        console.log('Error');
      }}
      catchError={(err) => {
        console.log('Bad things happened...');
        console.log(err);
      }}
    />
  );

  return (
    <Fragment>
      <h1 className="large text-primary">Donate to a Charity of Your Choice</h1>
      <p className="lead">
        Donations and Profits will go directly towards helping this site stay
        open.
      </p>
{/* 
      <CurrencyInput
        type="text"
        placeholder="  Please enter an amount you would like to donate"
        decimalsLimit={2}
        value={amount}
        // onChange={(value, name) => setAmount(value)}
        style= {{
          width: "20rem",
          height: "2rem"
        }}
        // required
      /> */}
      {'$'}<NumericInput precision={2} step={1} value={amount} min={1} max={100} />{'USD'}
      <br></br>
      <small className="form-text">
        If you do not enter an amount, a default of $1.00 will be used :)
      </small>
      <br></br>
      <br></br>
      <PaypalButton />
    </Fragment>
  );
};

Donations.propTypes = {
  isAuthenticated: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, { setAlert })(Donations);
