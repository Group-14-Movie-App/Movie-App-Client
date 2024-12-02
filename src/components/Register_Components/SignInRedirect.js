import React from 'react';

function SignInRedirect({ navigate }) {
  const handleSignInRedirect = () => {
    navigate('/sign-in-page');
  };

  return (
    <div className="signin-redirect">
      <p>Already registered?</p>
      <button onClick={handleSignInRedirect} className="signin-button">
        Sign In
      </button>
    </div>
  );
}

export default SignInRedirect;
