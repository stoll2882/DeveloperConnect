import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import Dropdown from './Dropdown/Dropdown'; 

export const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const authLinks = (
    <ul>
      <li style={{ marginTop: '20px' }}>
        <Link to="/profiles">Developers</Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <Link to="/posts">Posts</Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <Link to="/donations">Donate</Link>
      </li>
      {/* <li style={{ marginTop: '20px' }}>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li> */}
      { user && user.avatar &&
        <li style={{ marginLeft: '10px' }}>
          <Dropdown avatar={user.avatar} id={user._id}></Dropdown>
        </li>
      }
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark" >
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
