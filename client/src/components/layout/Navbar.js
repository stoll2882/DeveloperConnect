import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const authLinks = (
    <ul>
      <li style={{ marginTop: '20px' }}>
        <Link to="/profiles">Developers</Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <Link to="/posts">Posts</Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <Link to="/contact">Contact Us</Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <Link to="/donations">Donate</Link>
      </li>
      { user && user._id == "601107dc69e4e177ba3d4234" &&
        <li style={{ marginTop: '20px' }}>
          <Link to="/admin">Admin</Link>
        </li>
      }
      <li style={{ marginTop: '20px' }}>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li style={{ marginTop: '20px' }}>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
      { user && user.avatar &&
        <li style={{ marginLeft: '10px' }}>
          <img src={user.avatar} style={{ maxWidth: '50px', borderRadius: '200px' }}></img>
        </li>
      }
      {/* <li>
        <Dropdown options={["Export to CSV", "Manage Users", "Edit Profile"]} placeholder=''>
        </Dropdown>
        
      </li> */}
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
