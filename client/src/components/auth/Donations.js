import React, { Fragment, useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { stripePayment } from '../../actions/auth';
import { PayPalButton } from 'react-paypal-button-v2';
import PayPal from './PayPal';
import CurrencyInput from 'react-currency-input-field';
import NumericInput from 'react-numeric-input';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  ElementsConsumer
} from '@stripe/react-stripe-js';


const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
    base: {
      iconColor: "rgb(240, 57, 122)",
      color: "rgb(240, 57, 122)",
      fontSize: "16px",
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF"
      }
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238"
      }
    }
  }
};

function CardSection() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />
}

export const Donations = ({ isAuthenticated, setAlert, stripePayment }) => {
  const [amount, setAmount] = useState(1);
  const [money, setMoney] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

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
                value: document.getElementById('amountField').value,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('fail');
      return;
    }
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    
    if (error) {
      console.log(error);
    } else {
      var secret = await stripePayment(paymentMethod);
      var result = await stripe.confirmCardPayment(secret, {
        payment_method: paymentMethod.id
      });
      console.log(result);
    }
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Donate to a Charity of Your Choice</h1>
      <p className="lead">
        Donations and Profits will go directly towards helping this site stay
        open.
      </p>
      {'$'}<NumericInput 
        precision={2} 
        step={1} 
        value={amount} 
        min={1} 
        max={100}
        id='amountField' 
      />{'USD'}
      <br></br>
      <small className="form-text">
        If you do not enter an amount, a default of $1.00 will be used :)
      </small>
      <br></br>
      <br></br>
      <h2>Donate With Stripe</h2>
      {/* <form onSubmit> */}
      <form onSubmit={handleSubmit}>
        <CardElement />
        <br></br>
        <button type="submit" disabled={!stripe} className="btn">
          Donate With Stripe
        </button>
      </form>
      <br></br>
        {/* <button type="submit" className="btn">Donate With Stripe</button>
      </form> */}
      <br></br>
      <h2>Donate With PayPal</h2>
      <PaypalButton />
    </Fragment>
  );
};

Donations.propTypes = {
  isAuthenticated: PropTypes.bool,
  setAlert: PropTypes.func.isRequired,
  recaptchaApproved: PropTypes.bool,
  stripePayment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  recaptchaApproved: state.auth.recaptchaApproved,
});

export default connect(mapStateToProps, { setAlert, stripePayment })(Donations);
