import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Experience from '../dashboard/Experience';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    website,
    location,
    skills,
    githubusername,
    bio,
    experience,
    education,
    social: { youtube, twitter, facebook, linkedin, instagram },
  },
  currSearch,
  searchBy,
}) => {
  var contains;
  if (searchBy) {
    if (searchBy == 'name') {
      if (name.toLowerCase().indexOf(currSearch.toLowerCase()) != -1) {
        contains = true;
      } else {
        contains = false;
      }
    } else if (searchBy == 'location') {
      if (location.toLowerCase().indexOf(currSearch.toLowerCase()) != -1) {
        contains = true;
      } else {
        contains = false;
      }
    } else if (searchBy == 'skills') {
      contains = false;
      for (const skill of skills) {
        if (skill.toLowerCase().indexOf(currSearch.toLowerCase()) != -1) {
          contains = true;
        }
      }
    }
  } else {
    contains = true;
  }
  if (!currSearch) {
    contains = true;
  }

  var profileComplete = false;
  if (
    name && avatar 
    && company && website 
    && status && location 
    && skills.length > 0 
    && bio && githubusername 
    && experience.length > 0
    && education.length > 0
    && youtube && twitter
    && facebook && linkedin && instagram
  ) {
    profileComplete = true;
  }

  var img = new Image();
  img.addEventListener('load', function() {

  }, false);
  img.src = './emblemComplete.png';

  return (
    <div>
    { (contains) && (
        <div className="profile bg-light">
          <img src={avatar} alt="user avatar" /> 
          {/* add " className="round-img" to change image back to round */}
          <div>
            <h2>{name}</h2>
            { profileComplete &&
              <img src='./completeProfile.png' alt='profile complete emblem' style={{ maxWidth: '4rem' }} />
            }
            <p>
              {status} {company && <span> at {company}</span>}
            </p>
            <p className="my-1">{location && <span>{location}</span>}</p>
            <Link to={`/profile/${_id}`} className="btn btn-primary">
              View Profile
            </Link>
          </div>
          <ul>
            {skills.slice(0, 4).map((skill, index) => (
              <li key={index} className="text-primary">
                <i className="fas fa-check"></i> {skill}
              </li>
            ))}
          </ul>
        </div>
      )
    }
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
