import React from 'react';
import CitySelector from './CitySelector';

function RegisterForm({ formData, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="register-form">
      <div className="form-group">
        <label htmlFor="email">Enter Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <CitySelector value={formData.city} onChange={onChange} />
      </div>

      <button type="submit" className="register-button">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
