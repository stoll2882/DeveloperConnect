import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const DonationItem = ({
  donation: { _id, name, email, date, paymentMethod, amount },
}) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        {/* <Link to={`/profile/`}> */}
          <h4>{name}</h4>
        {/* </Link> */}
        {/* <p class="my-1">{text}</p> */}
        <p class="post-date">
          Donated on {date}
        </p>
      </div>
      <div>
        <ul style={{ listStyle: 'none' }}>
            <li><strong>Transaction Id:</strong> {_id}</li>
            <li><strong>Email:</strong> {email}</li>
            <li><strong>Payment Method:</strong> {paymentMethod}</li>
            <li><strong>Amount:</strong> ${amount}.00 USD</li>
        </ul>
      </div>
    </div>
  );
};

DonationItem.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { })(
  DonationItem
);