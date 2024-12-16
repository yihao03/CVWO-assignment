import React, { useState } from 'react';
import apiClient from "../api/axiosInstance.ts";
import UITemplate from "../components/sidebar.tsx";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const UserCreationForm: React.FC = () => {
  // State to store form input values
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Handle input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      // Send POST request to backend
      await apiClient.post('/users', formData);
      setSuccessMessage('User created successfully!');
    } catch (err) {
      setError(`Error creating user ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Basic form validation
  const validateForm = (): boolean => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setError('All fields are required');
      return false;
    }
    // Add more validation logic as needed
    return true;
  };

  return (
    <UITemplate>
    <div className="flex flex-col flex-grow place-items-center">
      <h1 className="text-5xl text-text mt-16 font-bold m-4">Create User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="bg-light m-1 p-1 text-gray-700 h-10 w-60"
            type={"text"}
            id="outlined-basic"
            name="username"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className="bg-light m-1 p-1 text-gray-700 h-10 w-60"
            type={"text"}
            id="outlined-basic"
            name="email"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            className="bg-light m-1 p-1 text-gray-700 h-10 w-60"
            type={"text"}
            id="outlined-basic"
            name="password"
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create User'}
        </button>
      </form>

      {error && <p style={{color: 'red'}}>{error}</p>}
      {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
    </div>
    </UITemplate>
  );
};

export default UserCreationForm;
