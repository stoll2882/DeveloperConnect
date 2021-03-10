import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { CometChat } from "@cometchat-pro/chat"
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const [help, setHelp] = useState(false);

  const handleNewUserMessage = (newMessage) => {
    if (newMessage == 'hello') {
      addResponseMessage(`Hello there, ${user.name}!`)
      setHelp(false);
    } else if (newMessage == 'help') {
      addResponseMessage(
        'Thank you for contacting us. Here are your options: \nPress 1 to here how our site works, \nPress 2 if you would like to leave us a message with your problem.'
      )
      setHelp(false);
    } else if (newMessage == '1') {
      addResponseMessage('Developer connect is a social media site that allows developers across the world to connect with one another as well as share their work and find partners for new endevours.')
      setHelp(false);
    } else if (newMessage == '2') {
      setHelp(true);
      addResponseMessage(`Please describe your problem, and we will get back to you as soon as we can!`);
    } else {
      if (help == true) {
        addResponseMessage(`Your message has been submitted. Thank you!`);
        setHelp(false);
      } else {
        setHelp(false);
        addResponseMessage('Your message is unrecognized. Please type hello or help. Thank you!')
      }
    }
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <img
        src={user.avatar}
        alt="user avatar"
        // className="round-img"
        style={{ maxWidth: '130px', border: "2px solid black" }}
      />
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />

          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className="my-w">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"></i> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
      <Widget
          handleNewUserMessage={handleNewUserMessage}
          // profileAvatar={logo}
          title="Have a question?"
          subtitle="We are here to help!"
          senderPlaceHolder="Type hello or help..."
        />
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
