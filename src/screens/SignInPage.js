import { useNavigate } from 'react-router-dom';

function SignInPage()
{
    const navigate = useNavigate();

    const handleRegisterRedirect = () => {
        navigate('/register-page'); // Redirect to Register Page
      };

    return(
        <div>
            <h1>This is Sign In Page</h1>

            {/* Redirect to Register Page */}
            <div className="register-redirect">
                <p>Don't have an account?</p>
                <button onClick={handleRegisterRedirect} className="register-button">Register Here</button>
            </div>
        </div>
    )
}

export default SignInPage;