import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import AdminProfileItem from './AdminProfileItem';
import { getProfiles, deleteAccount } from '../../actions/profile';
import { getUsersCSVString, getProfileCSVString, getCombinedCSVString, uploadCsv } from '../../actions/auth';
import { CSVLink, CSVDownload } from "react-csv";
import { setAlert } from '../../actions/alert';
import CSVReader from 'react-csv-reader';

const Profiles = ({ getProfiles, profile: { profiles, loading }, deleteAccount, getUsersCSVString, getProfileCSVString, getCombinedCSVString, uploadCsv, setAlert }) => {
  const [userCsvData, setUserCsvData] = useState(null);
  const [profileCsvData, setProfileCsvData] = useState(null);
  const [combinedCsvData, setCombinedCsvData] = useState(null);

  useEffect(async () => {
    getProfiles();
    setCombinedCsvData(await getCombinedCSVString());
    setUserCsvData(await getUsersCSVString());
    setProfileCsvData(await getProfileCSVString());
    console.log(combinedCsvData);
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

  const successUpload = (dataRead) => {
    console.log(dataRead);
    uploadCsv(dataRead);
    setAlert("User(s) uploaded successfully");
  }

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Download Database CSV</h1>
          {/* <br></br> */}
          {/* <button onClick={getUsersCSV}>Download Users to CSV File</button> */}
          {userCsvData && profileCsvData && combinedCsvData &&
            <div>
              {/* <CSVLink data={userCsvData} filename="DevConnect_Users.csv">Download Users to CSV File</CSVLink>
              <br></br>
              <CSVLink data={profileCsvData} filename="DevConnect_Profiles.csv">Download Profiles to CSV File</CSVLink>
              <br></br> */}
              <CSVLink data={combinedCsvData} filename="DevConnect_User_Information.csv">Download All User Data to CSV File</CSVLink>
            </div>
          }
          <br></br>
          <h1 className="large text-primary">Upload CSV To Database</h1>
          <h3>If user already exists in database, new user will not be registered.</h3>
          <br></br>
          <CSVReader onFileLoaded={(dataRead, fileInfo) => successUpload(dataRead)} />
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
  getCombinedCSVString: PropTypes.func.isRequired,
  uploadCsv: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles, deleteAccount, getUsersCSVString, getProfileCSVString, getCombinedCSVString, setAlert, uploadCsv })(Profiles);
