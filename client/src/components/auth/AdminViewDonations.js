import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getDonations } from '../../actions/auth';
import DonationItem from './DonationItem';

const AdminViewDonations = ({ getDonations, auth: { loading } }) => {
    const [donations, setDonations] = useState([]);
  useEffect(async () => {
    setDonations(await getDonations());
  }, [getDonations]);

  return !donations ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Donations</h1>
      <p className="lead">
        <i className="fas fa-user"></i> View all Donations Made to Developer Connect
      </p>
      <div className="posts">
        {donations.map((donation) => (
          <DonationItem donation={donation} />
        ))}
      </div>
    </Fragment>
  );
};

AdminViewDonations.propTypes = {
  getDonations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getDonations })(AdminViewDonations);