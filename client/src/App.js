import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import PrivacyPolicy from './components/auth/PrivacyNotice';
import FinishRegister from './components/auth/FinishRegister';
import TwoFactorConfirmation from './components/auth/TwoFactorConfirmation';
import TwoFactorLoginConfirmation from './components/auth/TwoFactorLoginConfirmation';
import PasswordReset from './components/auth/PasswordReset';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import EditPicture from './components/profile-forms/EditPicture';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import Contact from './components/auth/Contact';
import Donations from './components/auth/Donations';
import PrivateRoute from './components/routing/PrivateRoute';
import Admin from './components/auth/Admin';
import AdminProfile from './components/profile/AdminProfile';
import AdminViewDonations from './components/auth/AdminViewDonations';
import DonationLookup from './components/auth/DonationLookup';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// import './Bootstrap.css';
import './App.css';

import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  ElementsConsumer
} from '@stripe/react-stripe-js';
import CSVManagement from './components/auth/CSVManagement';

const stripePromise = loadStripe("pk_live_51IYyIFHsswTRtrVskRFd8DddZQez8f2Kv4Gx35gyvxvD6N2sGOXEZetI9o0BTtvssq396ZdoVI6bJIDQmaciLDGW001pq3McNg");

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // parameter with empty brackets makes sure it only runs once

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/finishregister" component={FinishRegister} />
              <Route
                exact
                path="/twofactorconfirmation"
                component={TwoFactorConfirmation}
              />
              <Route
                exact
                path="/passwordreset"
                component={PasswordReset}
              />
              <Route
                exact
                path="/twofactorloginconfirmation"
                component={TwoFactorLoginConfirmation}
              />
              <Route exact path="/privacypolicy" component={PrivacyPolicy} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              <Route exact path="/adminprofile/:id" component={AdminProfile} />
              <Route exact path="/lookuptransaction" component={DonationLookup} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <PrivateRoute
                exact
                path="/edit-picture"
                component={EditPicture}
              />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
              <PrivateRoute exact path="/contact" component={Contact} />
              <PrivateRoute exact path="/admin" component={Admin} />
              <PrivateRoute exact path="/csvmanagement" component={CSVManagement} />
              <PrivateRoute exact path="/adminviewdonations" component={AdminViewDonations} />
              <Elements stripe={stripePromise}>
                <PrivateRoute exact path="/donations" component={Donations} />
              </Elements>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
