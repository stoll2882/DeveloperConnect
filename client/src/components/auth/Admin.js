import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import AdminProfileItem from './AdminProfileItem';
import { getProfiles, deleteAccount } from '../../actions/profile';
import { getUsersCSVString, getProfileCSVString } from '../../actions/auth';
import { CSVLink, CSVDownload } from "react-csv";
import { setAlert } from '../../actions/alert';

const Profiles = ({ getProfiles, profile: { profiles, loading }, deleteAccount, getUsersCSVString, getProfileCSVString, setAlert }) => {
  const [userCsvData, setUserCsvData] = useState(null);
  const [profileCsvData, setProfileCsvData] = useState(null);

  useEffect(async () => {
    getProfiles();
    setUserCsvData(await getUsersCSVString());
    setProfileCsvData(await getProfileCSVString());
    console.log('done');
  }, [getProfiles]);

  // const getUsersCSV = () => {
  // const csvData = getCSVString();
  // }
  // if (userCsvData == null) {
  //   setUserCsvData(getUsersCSVString());
  // }
  // if (profileCsvData == null) {
  //   setProfileCsvData(getProfileCSVString());
  // }

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Download Database CSV</h1>
          {/* <br></br> */}
          {/* <button onClick={getUsersCSV}>Download Users to CSV File</button> */}
          {userCsvData && profileCsvData && 
            <div>
              <CSVLink data={userCsvData} filename="DevConnect_Users.csv">Download Users to CSV File</CSVLink>
              <br></br>
              <CSVLink data={profileCsvData} filename="DevConnect_Profiles.csv">Download Profiles to CSV File</CSVLink>
              {/* <CSVDownload data={csvData} target="_blank">Download Users V2</CSVDownload> */}
            </div>
          }
          <br></br>
          <h1 className="large text-primary">Manage Developers</h1>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <AdminProfileItem key={profile._id} profile={profile}></AdminProfileItem>
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
  deleteAccount: PropTypes.func.isRequired,
  getUsersCSVString: PropTypes.func.isRequired,
  getProfileCSVString: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles, deleteAccount, getUsersCSVString, getProfileCSVString, setAlert })(Profiles);
