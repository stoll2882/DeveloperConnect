import React from 'react';
import GoogleLoginWithButton, { GoogleLogin } from 'react-google-login';

function GmailLogin() {
  const responseGoogle = (response) => {
    console.log(response);
  };
  return (
    <GoogleLogin
      clientId="753445575160-cajf8p3ntsdrkhj6s744a7gflmdscd0j.apps.googleusercontent.com"
      buttonText="Log in with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default GmailLogin;
