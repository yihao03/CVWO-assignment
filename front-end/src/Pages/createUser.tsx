import React, { useState } from "react";
import apiClient from "../api/axiosInstance.ts";
import UITemplate from "../components/sidebar.tsx";
import { useNavigate } from "react-router";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const UserCreationForm: React.FC = () => {
  // State to store form input values
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  // Handle input change
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
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
    setSuccessMessage("");

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      // Send POST request to backend
      await apiClient.post("/users", formData);
      setSuccessMessage("User created successfully!");
      navigate("/users/login");
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
      setError("All fields are required");
      return false;
    }

    //TODO to improve email validation and implement in backend
    if (!email.includes("@")) {
      setError("please enter a valid email");
      return false;
    }
    // Add more validation logic as needed
    return true;
  };

  return (
    <UITemplate>
      <div className="flex flex-grow flex-col place-items-center justify-center">
        <h1 className="text-text m-4 mt-16 text-5xl font-bold">Create User</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div>
            <input
              className="bg-primary m-1 h-10 w-96 p-1 text-gray-700"
              type={"text"}
              id="outlined-basic"
              name="username"
              placeholder="Username"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              className="bg-primary m-1 h-10 w-96 p-1 text-gray-700"
              type={"text"}
              id="outlined-basic"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              className="bg-primary m-1 h-10 w-96 p-1 text-gray-700"
              type={"password"}
              id="outlined-basic"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-dark text-primary w-fit place-self-center rounded-sm px-2 py-1 font-thin"
          >
            {loading ? "Submitting..." : "Create User"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </UITemplate>
  );
};

export default UserCreationForm;
