import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './screensStyles/SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterRedirect = () => {
    navigate('/register-page'); // Redirect to Register Page
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://movieapp-backend1.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token); // Store the JWT token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user details
  
        // Redirect to Home Page
        navigate('/home-page');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Display error message
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>

      <form
        className="signin-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="form-group">
          <label htmlFor="email">Enter Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="register-redirect">
        <p>Don't have an account?</p>
        <button onClick={handleRegisterRedirect} className="register-button">
          Register
        </button>
      </div>
    </div>
  );
}

export default SignInPage;
