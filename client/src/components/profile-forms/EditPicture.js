import React, { Fragment, useState, useEffect } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import ImageUploader from 'react-images-upload';
import AvatarEditor from 'react-avatar-editor';
import Spinner from '../layout/Spinner';
import { uploadProfilePicture } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const EditPicture = ({
  avatar,
  addExperience,
  history,
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  uploadProfilePicture,
  setAlert,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  const [pictureUrl, setPictureUrl] = useState();
  const [picture, setPicture] = useState();
  const [updated, setUpdated] = useState(false);
  //   const onChange = (e) =>
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  const onPicChange = (picture) => {
    console.log(picture);
    setPicture(picture);
  };

  // if (updated) {
  //   return <Redirect to="/dashboard" />
  // }

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Add / Change your Profile Picture</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Profile pictures are a great way
        to connect individualy on a more personable level. Add and / or change
        one to connect with your peers!
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          uploadProfilePicture(picture);
          // window.location.reload();
          setUpdated(true);
          setAlert("Your profile picture has been updated. Refresh to view");
          setPicture('');
          // return <Redirect to="/dashboard"></Redirect>
          // getCurrentProfile();
        }}
      >
        <div
          style={{
            // border: '2px solid black',
            padding: '20px',
            borderRadius: '500px',
            textAlign: 'center',
          }}
        >
          <strong>Your Current Profile Picture:</strong>
          <br></br>
          <br></br>
          <img
            src={user.avatar}
            alt="user avatar"
            // className="round-img"
            style={{ maxWidth: '20rem' }}
          />
          {/* <AvatarEditor
            image={avatar}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
          /> */}
        </div>
        <br></br>
        <div
          style={{
            border: '2px solid black',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <strong>
            Upload an Image Below to Choose a New Profile Picture:
          </strong>
          <ImageUploader
            withIcon={true}
            withPreview={true}
            buttonText="Choose image"
            singleImage={true}
            onChange={onPicChange}
            imgExtension={['.jpg', '.jpeg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditPicture.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  uploadProfilePicture: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  uploadProfilePicture,
  setAlert,
})(withRouter(EditPicture));
