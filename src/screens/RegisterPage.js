import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './screensStyles/RegisterPage.css';
import RegisterForm from '../components/Register_Components/RegisterForm';
import SignInRedirect from '../components/Register_Components/SignInRedirect';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    city: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        navigate('/sign-in-page');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      {error && <p className="error-message">{error}</p>}
      <RegisterForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      <SignInRedirect navigate={navigate} />
    </div>
  );
}

export default RegisterPage;
