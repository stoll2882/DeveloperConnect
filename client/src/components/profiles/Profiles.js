import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import SearchField from 'react-search-field';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const searchClicked = value => {
    setCurrSearch(value);
  }

  const [currSearch, setCurrSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  const onChange = (e) => {
    const rbs = document.querySelectorAll('input[name="choice"]');
    for (const rb of rbs) {
      if (rb.checked) {
        setSearchBy(rb.value);
        console.log(searchBy);
        break;
      }
    }
  }

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            developers
          </p>
          <SearchField 
            placeHolder = "Search for a developer..."
            onSearchClick={searchClicked}
            default=''
          />
          <br></br>
          <br></br>
          <h3>What do you want to search by?</h3>
          <form>
            <input type="radio" name="choice" value="name" defaultChecked="true" onChange={(e) => (onChange(e))} />{' '}Name{' '}
            <input type="radio" name="choice" value="location" onChange={(e) => (onChange(e))}  />{' '}Location{' '}
            <input type="radio" name="choice" value="skills" onChange={(e) => (onChange(e))}  />{' '}Skills{' '}
          </form>
          <br></br>
          <div style={{alignContent: 'center', height: '40px' }}>
            <img src='./completeProfile.png' alt='profile complete emblem' 
              style={{ maxWidth: '4rem', float: 'left', marginRight: '10px', lineHeight: '50px' }} 
            /> {' '}
            <h4 style={{ marginBottom: '5px', lineHeight: '70px' }} > = Complete Profile</h4>
          </div>
          <br></br>
          <br></br>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} currSearch={currSearch} searchBy={searchBy} ></ProfileItem>
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
