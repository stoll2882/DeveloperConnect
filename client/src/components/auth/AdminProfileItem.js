import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { adminDeleteUser, deleteAccount } from '../../actions/profile';

const AdminProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
  adminDeleteUser,
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="user avatar" /> 
      {/* add " className="round-img" to change image back to round */}
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className="my-1">{location && <span>{location}</span>}</p>
        <Link to={`/adminprofile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
        <br></br>
        <br></br>
        <div className="my-w">
            <button className="btn btn-danger" onClick={() => adminDeleteUser(_id, name)}>
            <i className="fas fa-user-minus"></i> Delete User
            </button>
        </div>
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className="text-primary">
            <i className="fas fa-check"></i> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

AdminProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  adminDeleteUser: PropTypes.func.isRequired,
};

export default connect(null, { adminDeleteUser })(AdminProfileItem);