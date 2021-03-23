import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
// import Button from './Button';
import './Dropdown.css';
import { logout } from '../../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Dropdown = ({ avatar, id, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggle = (item) => {
    setShowDropdown(!showDropdown);
    console.log(showDropdown);
  }

  return (
    <Fragment>
      <div style={{ alignContent: 'center' }}>
        <Link to='/dashboard'>
          <img src={avatar} style={{ maxWidth: '50px', borderRadius: '200px' }}></img>
        </Link>
        <i className='fas fa-caret-down' style={{ margin: 'auto', marginLeft: '10px', marginTop: '25px', float: 'right'}} onClick={toggle}></i>
      </div>
      {showDropdown && (
        <ul className={'dropdown-menu'} style={{ display: 'block', paddingRight: '200px' }}>
          <li className='dropdown-link'>
            <Link to='/contact'>Contact Us</Link>
          </li>
          { id == "601107dc69e4e177ba3d4234" &&
            <li className='dropdown-link'>
              <Link to="/admin">Admin</Link>
            </li>
          }
          <li className='dropdown-link'>
            <Link to='/dashboard'>My Profile</Link>
          </li>
          <li className='dropdown-link'>
            <i className="fas fa-sign-out-alt" style={{ color: 'white' }}></i>
            <Link onClick={logout}>Logout</Link>
          </li>
        </ul>
      )}
    </Fragment>
  )
}

Dropdown.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(null, { logout })(Dropdown);
