import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

export const PrivacyPolicy = ({ facebookAttempted }) => {
  return (
    <Fragment>
      {!facebookAttempted && (
        <Link to="/register" className="btn">
          Back
        </Link>
      )}
      <br></br>
      <br></br>
      <h1 className="large text-primary">
        Developer Connect Privacy Policy and Terms of Service
      </h1>
      <h3>Last updated February 4th, 2021</h3>
      <br></br>
      <p>
        Developer Connect provides an environment for developers to create their
        very own developer profile. It allows developers to post about their
        code, their work, their experiences or anything developer related. They
        can view each others posts, connect with one another and build a
        developer profile that suits them. The webapp will also connect to
        consumers github account through their github username (if provided) in
        order to display their personal repositories.
        <br></br>
        <br></br>
      </p>
      <h2>Collection of your Personal Information</h2>
      <p>
        Developer Connect will collect and store the information you provide us
        with. This includes but is not limited to...
        <ul>
          <li>- Your Name</li>
          <li>- Your Email</li>
          <li>- Your github account / repositories / username</li>
          <li>- Your Work Experience</li>
          <li>- Your Education History</li>
        </ul>
        <br></br>
      </p>
      <p>
        Developer Connect will collect and store the information neccessary to
        make our site run smoothly.
        <br></br>
        Alike other sites, we will use cookies and other unique identifiers to
        make your experience easier for you. Information will be collected when
        your web browser or device access our site.
        <br></br>
        We will utilize google reCAPTCHA in order to prevent hacking and make
        sure your account, as well as our site is safe. This will verify you are
        human and not collect or save any personal information other than such.
        <br></br>
      </p>
      <h2>Purposes and Uses of Your Personal Information</h2>
      <p>
        Developer Connect will collect and store the information neccessary to
        make our site run smoothly.
        <br></br>
        Alike other sites, we will use cookies and other unique identifiers to
        make your experience easier for you. Information will be collected when
        your web browser or device access our site.
        <br></br>
        <h2>Facebook Login Option</h2>
        When you choose our facebook login information, we will collect certain
        personal information for the sole purpose of creating you a working
        account.
        <br></br>
        We will collect your name, email, and facebook Id for account creation
        purposes. No other personal facebook information will be collected and
        your account will remain secure.
        <br></br>
      </p>
    </Fragment>
  );
};

PrivacyPolicy.propTypes = {
  facebookAttempted: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  facebookAttempted: state.auth.facebookAttempted,
});

export default connect(mapStateToProps, null)(PrivacyPolicy);
