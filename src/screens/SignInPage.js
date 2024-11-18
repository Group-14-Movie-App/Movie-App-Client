import { useNavigate } from 'react-router-dom';
import './screensStyles/SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/register-page'); // Redirect to Register Page
  };

  const handleLogin = () => {
    // Handle login action here
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      
      <form className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Enter Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button type="button" className="login-button" onClick={handleLogin}>Login</button>
      </form>

      <div className="register-redirect">
        <p>Don't have an account?</p>
        <button onClick={handleRegisterRedirect} className="register-button">Register</button>
      </div>
    </div>
  );
}

export default SignInPage;
